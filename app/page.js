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

function App() {

  const MotionButton = motion(Button)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const newfilefolderRef = useRef(null)
  const newfolderRef = useRef(null)

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


  // for language selection
  const options = ["javascript", "cpp", "c", "python"]



  //state rendering
  const [infobox, setinfobox] = useState(false)
  const [changepath, setchangepath] = useState(false)
  const [newfolder, setnewfolder] = useState(false)
  const [newfilefolder, setnewfilefolder] = useState(false)


  //to save code and set infobox state
  const infocodesave = (codeid) => {

    setcodetosave(saved[codeid])

    setinfobox(prev => !prev);
  }

  //to fetch folders

  useEffect(() => {
    filefolderholder();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newfolderRef.current && !newfolderRef.current.contains(event.target)) {
        setnewfolder(false);
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

  // to fetch and send post request to backend for code suggestion and save the data in state  suggestion
  const handleonsubmit = async () => {
    await api.post('/ai', { prompt: saved.original }).then(res => setsuggestion(res.data.improved)).catch((err) => {
      console.log(err);;
    });

    console.log(suggestion)

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


        <div className=' '>

          <div className='flex flex-col gap-4 border rounded-2xl '>
            {/* <select className=' border  bg-gray-700  ' value={language} onChange={e => setlanguage(e.target.value)}>
              {
                options.map((lang, i) => (
                  <option key={i} className='text-white ' value={lang}>{lang}</option>
                ))
              }
            </select>
            <div className=' h-[250px] w-[250px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] flex items-center justify-center bg-amber-200'>

              <Editor
                value={saved['original']}
                height="100%"
                width=" 100%"
                theme="vs-dark"
                language={language}
                onChange={(value) => { handleupdatedata('original', value) }}


                className=' border-1 border-white rounded-lg'

              />
            </div> */}
            {/* <div className='flex gap-2.5'>

              <button onClick={handleonsubmit} className='bg-blue-500 w-17.5 h-6.5 rounded-lg border-b-2  font-semibold text-white'>
                Submit
              </button>
              <button onClick={() => infocodesave("original")} className='bg-green-500 w-17.5 h-6.5 rounded-l text-white font-bold'> Save</button>
            </div> */}

            <div className='flex flex-col  gap-3  border-zinc-400 rounded-2xl p-6 '>
              <div className='flex flex-col md:flex-row gap-1  md:gap-3'>

                <p className='text-lg md:text-4xl font-mono font-bold md:font-semibold md:py-4'>Recently</p>
                <p className='text-2xl md:text-4xl font-mono font-semibold md:py-4'>Added Files</p>
              </div>
              <div>
                <ul className='flex flex-col gap-3 overflow-y-auto h-96 '>
                  {Array.from({ length: 7 }).map((_, i) => (

                    <li key={i} className='bg-zinc-700  w-[75vw] md:w-[50vw] py-8 md:py-12 rounded-2xl'></li>
                  )

                  )}
                </ul>
              </div>
            </div>

          </div>

          {
            saved.improved.length > 0 && (
              <div className='pt-10 flex flex-col gap-3.5'>

                <Editor
                  value={saved.improved}
                  height="400px"
                  width="400px"
                  theme="vs-dark"
                  language={language}
                  onChange={(value) => handleupdatedata('improved', value)}
                  className=' border-2 border-black rounded-lg'


                />
                <button onClick={() => handleonsave('improved')} className='bg-green-500 w-17.5 h-6.5 rounded-l text-white font-bold'> Save</button>

              </div>
            )
          }
        </div>
        <div className='text-white py-6 px-10  mt-9'>
          {suggestion}


        </div>

   <AnimatePresence>

        {

          newfolder && (<motion.div ref={newfolderRef}
  initial={{ opacity: 0, y: '0%' }}
  animate={{  opacity: 1, y: '50%' }}
  exit={{ opacity: 0, y: '100%' }}
  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
  className="z-20 bg-zinc-800 p-3 rounded-xl absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
>

            <form className='flex flex-col gap-4 w-[30vw]' onSubmit={handleSubmit(foldercreate)}  >

              <div className='flex flex-col gap-3  '>

                <Input className='border rounded-md p-2' placeholder='folder Name' {...register("foldername")} />
                <Textarea className='border rounded-md p-2 h-46' type="text" placeholder='discription' {...register("folderdiscription")} />
              </div>
              <Button type='submit' className=' bg-teal-600 font-semibold  p-1 px-4 rounded-lg w-md mx-auto text-white hover:text-black'>submit</Button>
            </form>
            <div>

            </div>



          </motion.div>)
        }

        </AnimatePresence>

        {changepath && (<div className='border p-5 rounded flex flex-col gap-4'>
          <div className='flex flex-col '>

            <div className='flex justify-between gap-2'>
              <p className='font-bold text-gray-600'>currentpath</p>
              <p onClick={() => setchangepath(false)}><ImCross className='text-gray-600 hover:text-white' /></p>
            </div>
            <ul className='flex' >
              {
                breadpath.map((path, i) => (
                  <li key={i}>{path.filefoldername}/</li>
                ))
              }
            </ul>
          </div>
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

          <button className=' bg-green-400 py-1 px-2 text-black  rounded-lg' onClick={handleback} >Back</button>
          <button className='bg-blue-400 py-1 px-2 text-black  rounded-lg' onClick={() => setnewfolder(prev => !prev)}>Create folder</button>
        </div>)}
        {infobox && (<div className='flex flex-col gap-4 border border-white backdrop-blur-xl p-2 rounded-md absolute bg-gradient-to-tr from-purple-400/30 to-orange-300/30 top-[25%]'>

          <div className='bg-gray-800 rounded-xl p-4 flex flex-col gap-6'>
            <form onSubmit={handleSubmit(filecreate)} id='fileform' className=' flex flex-col gap-3 '>
              <input type="text" placeholder='Title' className='border rounded-lg p-2' {...register("filename")} />
              <input type="text" placeholder='Discription' className='border rounded-lg p-2' {...register("filediscription")} />
            </form>
            <p className='text-gray-400'>  Current save path - {currentpath.filefoldername}</p>
          </div>

          <div className='flex justify-between bg-gray-800 rounded-xl p-2  '>
            <button type='submit' form='fileform' className='border rounded-xl p-1 px-2'>Save</button>
            <button onClick={() => setchangepath(prev => !prev)} className='border rounded-xl p-1 px-2'>path</button>
          </div>

          <div className='flex justify-center '>
            <button onClick={() => handlecloseall()} className='bg-gray-800 p-1 px-2 border rounded-xl hover:bg-transparent'>Close</button>
          </div>
        </div>)}

        <div>
          <AnimatePresence>
          {
            newfilefolder && (

                <motion.div ref={newfilefolderRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{transformOrigin: "bottom right"}} transition={{ duration: 0.8, type: "spring", stiffness: 300, damping: 20 }} className='flex flex-col gap-2 bg-zinc-800 border p-2 rounded-xl absolute right-16 bottom-18 '>
                  <MotionButton whileTap={{scale: 0.9}} transition={{type: "spring", stiffness: 300, damping: 20}}  variant={"normal"} onClick={() => setnewfolder(true)} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New folder</MotionButton>
                  <MotionButton whileTap={{scale: 0.9}} transition={{type: "spring", stiffness: 300, damping: 20}}  variant={"normal"} onClick={() => setnewfile(true)} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New file</MotionButton>
                </motion.div>
            )
          }
              </AnimatePresence>
          <motion.div whileTap={{ scale: 0.9 }}  className=' absolute bottom-0 right-0 p-7 '>


            <Button className="bg-teal-500 rounded-full aspect-square text-black  p-6 hover:bg-teal-300" onClick={() => setnewfilefolder(prev => !prev)}>
            
              <FaPlus   />
            </Button>
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default App
