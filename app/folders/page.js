"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Editor from "@monaco-editor/react";
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Newfolder from '@/components/Newfolder';
import Changepath from '@/components/Changepath';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import File from '@/components/File';
import Folder from '@/components/Folder';



function page() {
    const {
        register,
        handleSubmit,
        reset, // <-- add this
        watch,
        formState: { errors },
    } = useForm()


    //hold data of folders and files
    const [filedata, setfiledata] = useState([])
    const [ordering, setordering] = useState([])
    const [files, setfiles] = useState([])
    const [searchstring, setsearchstring] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");





    //to toggle foldercreate
    const [newfolder, setnewfolder] = useState(false)
    const [renametrue, setrenametrue] = useState(false)
    const [changepath, setchangepath] = useState(false)
    const [order, setorder] = useState("order")


    //hold id and name of currunt folder
    const [currentpath, setcurrentpath] = useState({
        filefoldername: "root",
        filefolderid: "root",
        index: 0
    })
    // hold id's and names for breadcrumb
    const [breadpath, setbreadpath] = useState([
        {
            filefoldername: "root",
            filefolderid: "root",
            index: 0
        }])

    const [updateid, setupdateid] = useState(null)

    const [rename, setrename] = useState({
        name: null,
        discription: null,
        id: null
    })



    // to hold code 

    const [viewcode, setviewcode] = useState("nothing yet");
    const [viewcodecopy, setviewcodecopy] = useState(null);

    const [showcode, setshowcode] = useState(false);
    const [edit, setedit] = useState(false);
    const [onlyfiles, setonlyfiles] = useState(false);

    const timer = useRef(null)
    const searchtimer = useRef(null)





    //to fetch onlyfiles
    const handleonlyfiles = async () => {
        await axios.get("/api/alldata").then(res => setfiles(res.data.data));
        console.log(files);



    }

    useEffect(() => {
        if (onlyfiles) {
            handleonlyfiles();
        }

    }, [onlyfiles])

    // to search files according to search string
    const handlesearch = async () => {
        clearTimeout(searchtimer.current);
        searchtimer.current = setTimeout(async () => {
            if (searchstring) {
                await axios.post("/api/search", { searchstring: searchstring }).then(res => setSearchQuery(res.data.data));

            }
        }, 500);

    }

    useEffect(() => {
        handlesearch();
    }, [searchstring]);




    // to set ordering and which type of data to load
    const datatodisplay = useMemo(() => {
        const sourcedata = searchstring ? searchQuery : (onlyfiles ? files : filedata);


        if (order === "order") {
            return [...sourcedata].sort((a, b) => a.name.localeCompare(b.name));


        }
        else if (order === "date") {
            return [...sourcedata].sort((a, b) => new Date(b.time) - new Date(a.time))


        }

        else {
            return sourcedata
        }
    }, [order, filedata, searchstring, files, searchQuery, onlyfiles])



    // to fetch and store data
    const filefolderholder = async () => {
        await axios.post('api/getfilefolder', { path: currentpath.filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));

    }

    // to update path when we open folders
    const updatepath = async (path, name) => {
        setcurrentpath({
            filefolderid: path,
            filefoldername: name,
        });
        setbreadpath(prev => [...prev, { filefolderid: path, filefoldername: name, index: breadpath.length }]);

        await axios.post('api/getfilefolder', { path: path }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));
    }


    // to go back in file structure
    const handleback = async () => {
        if (breadpath.length > 1) {

            const newpath = [...breadpath.slice(0, -1)];

            setbreadpath(prev => [...prev.slice(0, -1)])

            setcurrentpath(newpath[newpath.length - 1]);
            await axios.post('api/getfilefolder', { path: newpath[newpath.length - 1].filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));
        }

    }


    const handlecrumbclick = async (index) => {
        if (breadpath.length > 1) {
            const newpath = [...breadpath.slice(0, index + 1)];
            setbreadpath(prev => [...prev.slice(0, index + 1)]);

            setcurrentpath(newpath[breadpath.length - 1]);
            await axios.post('api/getfilefolder', { path: newpath[newpath.length - 1].filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));

        }

    }
    //create folder
    const foldercreate = async (data) => {
        await axios.post('api/filefoldercreate', {
            filefolderdata: {
                name: data.foldername,
                discription: data.folderdiscription,
                parent: currentpath.filefolderid,
                type: "folder",
                language: "cpp",
                breadcrumb: Array.isArray(breadpath) ? [...breadpath] : [],

            }
        }).then(res => console.log(res)).catch(error => console.log(error));

        setnewfolder(false)

        filefolderholder();
    }


    // to setcode to view

    const opencode = (code, id) => {
        console.log(code);

        setupdateid(id);

        setshowcode(prev => !prev)

        if (code) {
            setviewcode(code);
            setviewcodecopy(code);
        }

        else {
            setviewcode("empty");
        }


    }

    const editocode = async () => {
        if (edit) {
            await axios.post("/api/updatecode", { code: viewcode, id: updateid }).catch(errors => console.log(errors));
            filefolderholder();
        }

    }

    //cancel edit 

    const canceledit = () => {
        if (!edit) {
            setedit(true);
        }

        else {
            setedit(false);
            setviewcode(viewcodecopy);
        }
    }

    // to edit files and folders 

    const filefolderedit = (id, name, discription) => {
        try {

            clearTimeout(timer.current)

            timer.current = setTimeout(() => {
                setrename({
                    name: name,
                    discription: discription,
                    id: id
                })

                setrenametrue(true);
            }, 2000);

        } catch (error) {
            console.log(error);

        }
    }

    // to save edited data

    const saverename = (data) => {
        try {
            axios.post('/api/folderfilerename', { name: data.name, discription: data.discription, id: rename.id })
            setrenametrue(false)


            filefolderholder();
        } catch (error) {
            console.log(error);

        }
    }

    // to fetch data on render
    useEffect(() => {
        filefolderholder();
    }, [])

    // to reset form when renametrue is true

    useEffect(() => {
        if (renametrue) {
            reset({
                name: rename.name,
                discription: rename.discription
            });
        }
    }, [rename, renametrue, reset]);



    return (
        <div className=' max-w-screen relative h-auto  ' >


            <div className='border p-5 rounded flex flex-col gap-4 max-w-[80vw] mx-auto   '>
                <div className=' flex justify-between'>

                    <div className='flex flex-col  '>

                        <div>
                            <p className='font-bold text-gray-600'>currentpath</p>

                        </div>
                        <div>

                            <ul className=' text-white  ' >

                                <Breadcrumb  className="hover:cursor-pointer">
                                    <BreadcrumbList>
                                           { breadpath.map((path, i) => (
                                            <React.Fragment  key={i}>
                                                <BreadcrumbItem onClick={() => handlecrumbclick(path.index)}>
                                                    {path.filefoldername}
                                                </BreadcrumbItem>
                                                 <BreadcrumbSeparator>
                                                 /
                                                 </BreadcrumbSeparator>
                                            </React.Fragment>
                                        ))}
                                       
                                    </BreadcrumbList>
                                </Breadcrumb>

                            </ul>
                        </div>


                        <div>

                        </div>
                    </div>

                    <div >
                        <Input onChange={(e) => setsearchstring(e.target.value)} placeholder="Search" className={" hidden md:block md:w-96"} />
                    </div>

                    <Select onValueChange={value => setorder(value)} defaultValue={"order"}>
                        <SelectTrigger >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"unorder"}>
                                Unorder
                            </SelectItem>
                            <SelectItem value={"order"}>
                                {"order(A-Z)"}
                            </SelectItem>

                            <SelectItem value={"date"}>By date</SelectItem>
                            <p className='flex items-center gap-1 p-1 border rounded-md '>
                                <Checkbox checked={onlyfiles} onCheckedChange={(value) => setonlyfiles(value)} />

                                <Label className={"text-[13px]"}>Only files</Label>
                            </p>
                        </SelectContent>
                    </Select>
                </div>

                <div className=' md:hidden'>
                    <Input placeholder="Search" className={" md:w-76"} />
                </div>

                <div className='overflow-y-auto flex flex-col gap-2 h-[68vh]'>


                    {

                        datatodisplay.length > 0 ? (
                            datatodisplay.map((file, i) => {

                                if (file.type === "folder") return (
                                    <Folder key={i} file={file} i={i} rename={rename} renametrue={renametrue} filefolderedit={filefolderedit} timer={timer} updatepath={updatepath} />

                                )

                                else
                                    if (file.type === "file") return (
                                        <File key={i} file={file} i={i} rename={rename} renametrue={renametrue} filefolderedit={filefolderedit} timer={timer} opencode={opencode} />
                                    )
                            })) : (
                            <div className='text-blue-400'>there are no folders yet</div>
                        )


                    }
                </div>
                <div className=' flex justify-between gap-12'>

                    <Button className=' py-1 px-2 text-black hover:bg-zinc-400  font-semibold rounded-lg  w-26 md:w-40' onClick={handleback}>Back</Button>
                    <Button className='bg-teal-500 font-semibold text-sm md:py-1 md:px-2 text-black  rounded-lg  w-26 md:w-40' onClick={() => setnewfolder(prev => !prev)}>{!newfolder ? "New folder" : "close"}</Button>
                </div>

                {

                    newfolder && (<Newfolder foldercreate={foldercreate} newfolder={newfolder} setnewfolder={setnewfolder} setchangepath={setchangepath} />)
                }

            </div>

            {
                changepath && (
                    <Changepath breadpath={breadpath} filedata={filedata} handleback={handleback} setchangepath={setchangepath} updatepath={updatepath} />
                )
            }


            {showcode && (<div className=' absolute top-[50%] left-[50%] transform -translate-y-1/2 -translate-x-1/2 flex gap flex-col gap-3 ' >
                <Editor

                    value={viewcode}
                    height="400px"
                    width="400px"
                    theme="vs-dark"
                    language={"c++"}
                    options={{
                        readOnly: !edit
                    }}
                    onChange={(value) => setviewcode(value)}
                    className=' border-1 border-white '


                />
                <div className='flex justify-around'>
                    <Button onClick={canceledit} className=' p-1 px-4 rounded-lg'>{!edit ? "edit" : "cancel edit"}</Button>
                    <Button onClick={() => setshowcode(false)} className=' p-1 px-4 rounded-lg'>close</Button>
                    <Button onClick={editocode} className='p-1 px-4 rounded-lg'>save</Button>
                </div>
            </div>
            )}


            {
                renametrue && (
                    <div className='bg-gray-600  m-auto rounded-xl p-2 flex flex-col gap-4 text-white absolute top-[50%] left-[50%] transform -translate-y-1/2 -translate-x-1/2'>

                        <form id='renameform' className='flex flex-col' onSubmit={handleSubmit(saverename)}>
                            <p>
                                Name <input className='p-2' type="text" defaultValue={rename.name} {...register("name")} />
                            </p>
                            <p>
                                discription <input className='p-2' type="text" defaultValue={rename.discription} {...register("discription")} />
                            </p>
                        </form>


                        <div className='flex justify-between'>
                            <Button onClick={() => setrenametrue(false)}>close</Button>
                            <Button type='submit' form='renameform' className='bg-blue-500 p-1 px-3 rounded-sm'>save</Button>
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default page