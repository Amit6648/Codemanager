"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Editor from "@monaco-editor/react";
import { AnimatePresence, motion, scale } from "motion/react"
import { Button } from '@/components/ui/button';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Newfolder from '@/components/Newfolder';
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

    //to toggle foldercreate
    const [newfolder, setnewfolder] = useState(false)

    //hold id and name of currunt folder
    const [currentpath, setcurrentpath] = useState({
        filefoldername: "root",
        filefolderid: "root"
    })
    // hold id's and names for breadcrumb
    const [breadpath, setbreadpath] = useState([
        {
            filefoldername: "root",
            filefolderid: "root"
        }])

    const [updateid, setupdateid] = useState(null)

    const [rename, setrename] = useState({
        name: null,
        discription: null,
        id: null
    })

    const [renametrue, setrenametrue] = useState(false)
     const [changepath, setchangepath] = useState(false)


    // to hold code 

    const [viewcode, setviewcode] = useState("nothing yet")
    const [viewcodecopy, setviewcodecopy] = useState(null)

    const [showcode, setshowcode] = useState(false)

    const [edit, setedit] = useState(false);


    const timer = useRef(null)

    // to fetch and store data
    const filefolderholder = async () => {
        await axios.post('api/getfilefolder', { path: currentpath.filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));

    }

    // to update path when we open folders
    const updatepath = async (path, name) => {
        setcurrentpath({
            filefolderid: path,
            filefoldername: name
        });
        setbreadpath(prev => [...prev, { filefolderid: path, filefoldername: name }]);

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
    //create folder
    const foldercreate = async (data) => {
        await axios.post('api/filefoldercreate', {
            filefolderdata: {
                name: data.foldername,
                discription: data.folderdiscription,
                parent: currentpath.filefolderid,
                type: "folder"
            }
        }).then(res => console.log(res)).catch(error => console.log(error));

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
        <div className=' max-w-screen relative  ' >


            <div className='border p-5 rounded flex flex-col gap-4 max-w-[80vw] mx-auto   '>
                <div className='flex flex-col  '>

                    <div className='flex justify-between gap-2'>
                        <p className='font-bold text-gray-600'>currentpath</p>

                    </div>
                    <ul className='flex text-white' >
                        {
                            breadpath.map((path, i) => (
                                <Breadcrumb key={i}>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                           {path.filefoldername}
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                    </BreadcrumbList>
                                </Breadcrumb>
                            ))
                        }
                    </ul>
                </div>

                <div className='overflow-y-auto flex flex-col gap-2 h-[68vh]'>

               
                {filedata.length > 0 ? (
                    filedata.map((file, i) => {

                        if (file.type === "folder") return (
                            <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-yellow-700"} border flex flex-col text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-yellow-600 `} onPointerDown={() => filefolderedit(file._id, file.name, file.discription)} onPointerUp={() => clearTimeout(timer.current)} onDoubleClick={() => updatepath(file._id, file.name)}>
                                <p>{file.name}</p>
                                <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
                                <p> file type - {file.type}</p>

                            </div>

                        )

                        else
                            if (file.type === "file") return (
                                <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-blue-700"} border flex flex-col text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-blue-600 `} onDoubleClick={() => opencode(file.code, file._id)} onPointerDown={() => filefolderedit(file._id, file.name, file.discription)} onPointerUp={() => clearTimeout(timer.current)}>
                                    <p>{file.name}</p>
                                    <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
                                    <p> file type - {file.type}</p>


                                </div>

                            )
                    })) : (
                    <div className='text-blue-400'>there are no folders yet</div>
                )
                }
                 </div>
                <div className=' flex justify-between gap-12'>

                    <Button className=' py-1 px-2 text-black hover:bg-zinc-400  font-semibold rounded-lg w-40' onClick={handleback}>Back</Button>
                    <Button className='bg-teal-500 font-semibold py-1 px-2 text-black  rounded-lg w-40' onClick={() => setnewfolder(prev => !prev)}>{!newfolder ? "New folder" : "close"}</Button>
                </div>

                {

                    newfolder && (<Newfolder foldercreate={foldercreate} newfolder={newfolder} setnewfolder={setnewfolder} />)
                }

            </div>


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