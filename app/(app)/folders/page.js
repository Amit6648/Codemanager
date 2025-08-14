"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Editor from "@monaco-editor/react";
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import Newfolder from '@/components/Newfolder';
import Changepath from '@/components/Changepath';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import File from '@/components/File';
import Folder from '@/components/Folder';
import Breadcrumbmine from '@/components/Breadcrumbmine';
import Rename from '@/components/Rename';




import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';



function Page() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm()

    //hold data of folders and files
    const [filedata, setfiledata] = useState([])
    const [files, setfiles] = useState([])
    const [searchstring, setsearchstring] = useState(null)
    const [searchQuery, setSearchQuery] = useState([]);
    const [eletodelete, seteletodelete] = useState(null)

    //to toggle foldercreate
    const [newfolder, setnewfolder] = useState(false)
    const [renametrue, setrenametrue] = useState(false)
    const [changepath, setchangepath] = useState(false)
    const [order, setorder] = useState("order")
    const [isdialogopen, setisdialogopen] = useState(false)
    const [loading, setloading] = useState(true)


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


    // Animation Variants
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.90 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };


    // to handle delete dialog state 

    const handledialogdata = (data) => {
        setisdialogopen(prev => !prev);
        seteletodelete(data);

    }


    // to delete files

    const handleDelete = async () => {
        try {
            await axios.post("/api/delete", { id: eletodelete._id });
            setisdialogopen(false);
            filefolderholder(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };


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
                await axios.post("/api/search", { searchstring: searchstring }).then(res => setSearchQuery(res.data.data || []));
            }
        }, 500);
    }

    useEffect(() => {
        handlesearch();
    }, [searchstring]);

    // to set ordering and which type of data to load
    const datatodisplay = useMemo(() => {
        const sourcedata = searchstring ? searchQuery : (onlyfiles ? files : filedata) || [];


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
        setloading(true);
        try {
            await axios.post('api/getfilefolder', { path: currentpath.filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));

        } catch (error) {
            console.log(error);

        }
        finally {
            setloading(false);
        }
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
            setrename({
                name: name,
                discription: discription,
                id: id
            })

            setrenametrue(true);
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
        <div className=' max-w-screen relative h-auto backdrop-blur-xl ' >

            <motion.div
                className='border p-5 rounded flex flex-col gap-4 max-w-[85vw] md:max-w-[75vw] mx-auto'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className=' flex justify-between'>
                    <div className='flex flex-col'>
                        <div>
                            <p className='font-bold text-gray-600'>currentpath</p>
                        </div>
                        <div>
                            <Breadcrumbmine breadpath={breadpath} handlecrumbclick={handlecrumbclick} />
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
                    <Input onChange={(e) => setsearchstring(e.target.value)} placeholder="Search" className={"md:block md:w-96"} />
                </div>

                <motion.div
                    className='overflow-y-auto flex flex-col gap-2 h-[68vh]'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {!loading ? (
                        datatodisplay.length > 0 ? (
                            datatodisplay.map((file, i) => (
                                <motion.div key={i} variants={itemVariants}>
                                    {file.type === "folder" ? (
                                        <Folder key={i} file={file} i={i} rename={rename} renametrue={renametrue} filefolderedit={filefolderedit} timer={timer} updatepath={updatepath} handledialogdata={handledialogdata} />
                                    ) : (
                                        <File key={i} file={file} i={i} rename={rename} renametrue={renametrue} filefolderedit={filefolderedit} timer={timer} opencode={opencode} handledialogdata={handledialogdata} />
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className='text-blue-400'>there are no folders or files yet</div>
                        )
                    ) : (
                        <div className='flex flex-col gap-3'>
                            <Skeleton className={"bg-zinc-600 w-full h-16 rounded-2xl"} />
                            <Skeleton className={"bg-zinc-600 w-full h-16 rounded-2xl"} />


                        </div>
                    )}
                </motion.div>
                <div className=' flex justify-between gap-12'>
                    <Button className=' py-1 px-2 text-black hover:bg-zinc-400 font-semibold rounded-lg w-26 md:w-40' onClick={handleback}>Back</Button>
                    <Button className='bg-teal-500 font-semibold text-sm md:py-1 md:px-2 text-black rounded-lg w-26 md:w-40' onClick={() => setnewfolder(prev => !prev)}>{!newfolder ? "New folder" : "close"}</Button>
                </div>

                <AnimatePresence>
                    {newfolder && (
                        <motion.div
                            initial="hidden" animate="visible" exit="exit" variants={modalVariants}
                            className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
                        >
                            <Newfolder foldercreate={foldercreate} newfolder={newfolder} setnewfolder={setnewfolder} setchangepath={setchangepath} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {changepath && (
                    <motion.div
                        initial="hidden" animate="visible" exit="exit" variants={modalVariants}
                        className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
                    >
                        <Changepath breadpath={breadpath} filedata={filedata} handleback={handleback} setchangepath={setchangepath} updatepath={updatepath} />
                    </motion.div>
                )}

                {showcode && (
                    <motion.div
                        initial="hidden" animate="visible" exit="exit" variants={modalVariants}
                        className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center'
                    >
                        <div className='flex flex-col gap-3' >
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
                    </motion.div>
                )}

                {renametrue && (
                    <motion.div
                        initial="hidden" animate="visible" exit="exit" variants={modalVariants}
                        className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'
                    >
                        <Rename saverename={saverename} rename={rename} setrenametrue={setrenametrue} />
                    </motion.div>
                )}
            </AnimatePresence>


            <div>
                <AlertDialog open={isdialogopen} onOpenChange={setisdialogopen}>
                    <AlertDialogContent className={"bg-black/80 text-white "}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <span className="font-bold"> {eletodelete?.name} </span>
                                {eletodelete?.type}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className={"bg-red-700 text-white"} onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

export default Page;