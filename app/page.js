"use client"
import { useState, useEffect, useRef } from 'react'
import Editor from "@monaco-editor/react";
import { useForm } from "react-hook-form"
import axios from 'axios';
import { ImCross } from "react-icons/im";
import { Sidebar, SidebarContent, SidebarProvider, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { FaRegFileCode } from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";
import { Button } from '@/components/ui/button';
import { FaPlus } from "react-icons/fa";
import { AnimatePresence, motion, scale } from "motion/react"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RxCross2 } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function App() {

  const MotionButton = motion(Button)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const newfilefolderRef = useRef(null)


  // All the states for holding data
  const [language, setlanguage] = useState("cpp")
  const [suggestion, setsuggestion] = useState('')
  // to hold improved and orignal code 
  const [saved, setsaved] = useState({
    original: '',
    improved: ''
  })


  //to hold current folder addresss
  const [currentpath, setcurrentpath] = useState({
    filefoldername: "root",
    filefolderid: "root"
  })

  const [breadpath, setbreadpath] = useState([
    {
      filefoldername: "root",
      filefolderid: "root"
    }])

  //to save folder data fetched from backend
  const [filedata, setfiledata] = useState([])

  const [codetosave, setcodetosave] = useState(null)

  const [recentlyupdated, setrecentlyupdated] = useState([])


  // for language selection
  const options = ["javascript", "cpp", "c", "python"]



  //state rendering
  const [infobox, setinfobox] = useState(false)
  const [changepath, setchangepath] = useState(false)
  const [newfolder, setnewfolder] = useState(false)
  const [newfilefolder, setnewfilefolder] = useState(false)
  const [newfile, setnewfile] = useState(false)


  //to save code and set infobox state
  const infocodesave = (codeid) => {

    setcodetosave(saved[codeid])

    setinfobox(prev => !prev);
  }

  //to fetch folders

  useEffect(() => {
    filefolderholder();
  }, [])

  //to get recently created files
  const getrecentlycreated = async () => {
    await axios.get('api/recentlycreated').then(res => setrecentlyupdated(res.data)).catch(error => console.log(error));
  }

  useEffect(() => {
    getrecentlycreated();
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newfilefolderRef.current && !newfilefolderRef.current.contains(event.target)) {
        setnewfilefolder(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //to create folders
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

  //to create files

  const filecreate = async (data) => {
    await axios.post('api/filefoldercreate', {
      filefolderdata: {
        name: data.filename,
        discription: data.filediscription,
        parent: currentpath.filefolderid,
        type: "file",
        code: codetosave
      }
    }).then(res => console.log(res)).catch(error => console.log(error));

    filefolderholder();

  }



  // to update changes one's the data is updated in the state because react states require a rerender to appear changes

  useEffect(() => {

    const match = suggestion.match(/```([\s\S]*)```/)
    if (match) {
      setsaved(prev => ({
        ...prev, improved: match[1]
      }));
      console.log("data");
    }
  }, [suggestion])


  //to update code in ide
  const handleupdatedata = (id, content) => {
    setsaved(prev => ({ ...prev, [id]: content }))
  }



  const filefolderholder = async () => {
    await axios.post('api/getfilefolder', { path: currentpath.filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));

    console.log(filedata);

  }

  const updatepath = async (path, name) => {
    setcurrentpath({
      filefolderid: path,
      filefoldername: name
    });
    setbreadpath(prev => [...prev, { filefolderid: path, filefoldername: name }]);

    await axios.post('api/getfilefolder', { path: path }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));
  }

  const handleback = async () => {
    if (breadpath.length > 1) {

      const newpath = [...breadpath.slice(0, -1)];

      setbreadpath(prev => [...prev.slice(0, -1)])

      setcurrentpath(newpath[newpath.length - 1]);
      await axios.post('api/getfilefolder', { path: newpath[newpath.length - 1].filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));
    }

  }


  const handlecloseall = () => {
    setinfobox(false);
    setchangepath(false)
  }



  return (
    <>
      <div className=' h-full   flex flex-col items-center justify-center  text-white  relative  '>


        {
          newfile && (

            <div className='flex flex-col gap-2 rounded-2xl  absolute bg-black/50 backdrop-blur-md p-4 '>
              <div className='flex items-center justify-between'>


                <Select onValueChange={(value) => setlanguage(value)} defaultValue={language}>
                  <SelectTrigger className={'w-36'}>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className='bg-zinc-800 text-white'>
                    {options.map((option, i) => (
                      <SelectItem key={i} value={option} className='bg-zinc-800 text-white hover:bg-zinc-700'>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className=' hover:cursor-pointer text-xl font-bold  rounded-full p-1 border hover:text-black   hover:bg-white '>
                  <RxCross2 onClick={() => setnewfile(false)} />
                </span>
              </div>

              <div className=' h-[250px] w-[250px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] flex items-center justify-center rounded-2xl  '>

                <Editor
                  value={saved['original']}
                  height="100%"
                  width=" 100%"

                  defaultLanguage='cpp'
                  options={{
                    selectOnLineNumbers: true,
                    fontSize: 14,
                    minimap: {
                      enabled: false
                    }
                  }}
                  onMount={(editor, monaco) => {
                    editor.focus();
                    editor.setValue("// Write your code here");
                  }}

                  theme="vs-dark"
                  language={language}
                  onChange={(value) => { handleupdatedata('original', value) }}


                  className='rounded-lg'

                />
              </div>
              <div className='flex justify-center items-center '>
                <Button className=' bg-transparent font-semibold  p-1 px-6 rounded-lg border  text-white hover:text-black' onClick={() => infocodesave('original')}>Create</Button>
              </div>



            </div>

          )}
        <div className='flex flex-col  gap-3  border-zinc-400 rounded-2xl p-6 '>
          <div className='flex flex-col md:flex-row gap-1  md:gap-3'>

            <p className='text-lg md:text-4xl font-mono font-bold md:font-semibold md:py-4'>Recently</p>
            <p className='text-2xl md:text-4xl font-mono font-semibold md:py-4'>Added Files</p>
          </div>
          <div>
            <ul className='flex flex-col gap-3 overflow-y-auto h-96 '>
              {
                recentlyupdated.map((file, i) => (
                  <li  key={i} className='bg-zinc-700  w-[75vw] md:w-[50vw] p-3 rounded-2xl'>
                    <p className='text-white'>{file.name}</p>
                    <p className='text-gray-300 text-sm'>Discription - {file.discription}</p>
                    <p className='text-gray-300 text-sm'>Type - {file.type}</p>
                    <p className='text-gray-300 text-sm'>Created at - {new Date(file.time).toLocaleString()}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>



        <AnimatePresence>

          {newfolder && (

            <motion.div
              initial={{ opacity: 0, y: '0%' }}
              animate={{ opacity: 1, y: '50%' }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
              className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2'

            >

              <div className='flex justify-end items-center p-2 '>

                <motion.span className=' hover:cursor-pointer text-xl font-bold bg-zinc-800 rounded-full p-1 border  '>
                  <RxCross2 onClick={() => setnewfolder(false)} />
                </motion.span>
              </div>

              <div className="z-20  p-3 rounded-xl border bg-zinc-800 border-zinc-500 ">



                <form className='flex flex-col gap-4 w-[60vw] md:w-[30vw] ' onSubmit={handleSubmit(foldercreate)}  >


                  <div className='flex flex-col gap-3  '>

                    <Input className='border rounded-md p-2' placeholder='folder Name' {...register("foldername")} />
                    <Textarea className='border rounded-md p-2 h-46' type="text" placeholder='discription' {...register("folderdiscription")} />
                  </div>
                  <div className='flex justify-around gap-2'>

                    <Button onClick={() => setnewfolder(false)} type='submit' className=' bg-teal-600 font-semibold  p-1 px-6 rounded-lg  text-white hover:text-black'>Create</Button>
                    <Button type='button' onClick={() => setchangepath(true)} className={"font-semibold  p-1 px-6 rounded-lg  "}>Path</Button>
                  </div>
                </form>
                <div>

                </div>


              </div>

            </motion.div>)
          }

        </AnimatePresence>

        {changepath && (<div className='border p-5 rounded-2xl flex flex-col gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 w-[50vw] md:w-[30vw] z-30'>
          <div className='flex flex-col '>

          
            <div>

              <ul className='flex' >
                {
                  breadpath.map((path, i) => (
                    <li key={i}>{path.filefoldername}/</li>
                  ))
                }
              </ul>
            </div>

          </div>

          <div className='flex flex-col gap-3 overflow-y-auto h-96 border rounded-2xl p-4 '>
            {filedata.length > 0 ? (
              filedata.map((file, i) => (
                <div key={i} className=' border flex flex-col text-white  hover:cursor-pointer p-3 rounded-xl ' onClick={() => updatepath(file._id, file.name)}>
                  <p>{file.name}</p>
                  <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
                  <p> file type - {file.type}</p>

                </div>

              ))) : (
              <div className='text-blue-400'>there are no folders yet</div>
            )
            }
          </div>
          <div className='flex justify-between '>
            <Button className={"w-30 bg-zinc-900 text-white hover:bg-zinc-700 "} onClick={handleback}>Back</Button>
            <Button className=' w-30 py-1 px-2 text-black  rounded-lg hover:bg-zinc-400' onClick={() => setchangepath(false)}>Close</Button>
          </div>
        </div>)}
        {infobox && (<div className='flex flex-col gap-4 border bg-zinc-900  rounded-md absolute  top-[25%]  w-[35vw] p-3'>
          <ImCross className='text-white text-sm hover:cursor-pointer hover:text-black self-end' onClick={handlecloseall} />
          <div className='  flex flex-col gap-6'>
            <form onSubmit={handleSubmit(filecreate)} id='fileform' className=' flex flex-col gap-3 '>
              <Input type="text" placeholder='File Name' className='border rounded-lg p-2' {...register("filename")} />
              <Textarea type="text" placeholder='Discription' className='border rounded-lg p-2 h-36' {...register("filediscription")} />
            </form>
            <p className='text-gray-400'>  Current save path - {currentpath.filefoldername}</p>
          </div>

          <div className='flex justify-between   '>
            <Button form='fileform' type='submit' className='bg-teal-600 font-semibold  p-1 px-6 rounded-lg  text-white hover:text-black'>Create</Button>
            <Button onClick={() => setchangepath(true)} className='font-semibold  p-1 px-6 rounded-lg  '>Change Path</Button>
          </div>


        </div>)}

        <div>
          <AnimatePresence>
            {
              newfilefolder && (

                <motion.div ref={newfilefolderRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ transformOrigin: "bottom right" }} transition={{ duration: 0.8, type: "spring", stiffness: 300, damping: 20 }} className='flex flex-col gap-2 bg-zinc-800 border p-2 rounded-xl absolute right-16 bottom-18 '>
                  <MotionButton whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} variant={"normal"} onClick={() => setnewfolder(true)} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New folder</MotionButton>
                  <MotionButton onClick={() => setnewfile(prev => !prev)} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} variant={"normal"} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New file</MotionButton>
                </motion.div>
              )
            }
          </AnimatePresence>
          <motion.div whileTap={{ scale: 0.9 }} className=' absolute bottom-0 right-0 p-7 '>


            <Button className="bg-teal-500 rounded-full aspect-square text-black  p-6 hover:bg-teal-300" onClick={() => setnewfilefolder(prev => !prev)}>

              <FaPlus />
            </Button>
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default App
