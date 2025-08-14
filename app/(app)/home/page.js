"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios';
import { ImCross } from "react-icons/im";
import { Button } from '@/components/ui/button';
import { FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import Newfolder from '@/components/Newfolder';
import Changepath from '@/components/Changepath';
import Filecreateeditor from '@/components/Filecreateeditor';
import Editoronly from '@/components/ui/Editoronly';
import Breadcrumbmine from '@/components/Breadcrumbmine';


function App() {
  const { data: session } = useSession();


  const MotionButton = motion(Button)
  const {
    register,
    handleSubmit,
    reset, // Import reset from useForm
    formState: { errors },
  } = useForm()

  const newfilefolderRef = useRef(null)

  // All the states for holding data
  const [language, setlanguage] = useState("cpp")
  const [currentpath, setcurrentpath] = useState({
    filefoldername: "root",
    filefolderid: "root"
  })
  const [breadpath, setbreadpath] = useState([
    {
      filefoldername: "root",
      filefolderid: "root"
    }
  ])
  const [filedata, setfiledata] = useState([])
  const [codetosave, setcodetosave] = useState(null)
  const [recentlyupdated, setrecentlyupdated] = useState([])
  const [recentcode, setrecentcode] = useState(null)

  // for language selection
  const options = ["javascript", "cpp", "c", "python"]

  // State for rendering modals and UI elements
  const [infobox, setinfobox] = useState(false)
  const [changepath, setchangepath] = useState(false)
  const [newfolder, setnewfolder] = useState(false)
  const [newfilefolder, setnewfilefolder] = useState(false)
  const [newfile, setnewfile] = useState(false)
  const [filesloading, setfilesloading] = useState(true)

  // Opens the file info modal after code is saved in the editor
  const infocodesave = () => {
    setinfobox(true);
    setnewfile(false); // Close the editor modal when the info box opens
  }

  // Fetches files and folders for the current path
  const filefolderholder = async () => {
    try {
      const res = await axios.post('api/getfilefolder', { path: currentpath.filefolderid });
      setfiledata(res.data.files);
    } catch (error) {
      console.error("Failed to fetch folder data:", error);
    }
  }

  // Fetches recently created files
  const getrecentlycreated = async () => {
    setfilesloading(true);
    try {
      const res = await axios.get('api/recentlycreated');
      setrecentlyupdated(res.data);
    } catch (error) {
      console.error("Failed to fetch recent files:", error);
    }
    finally {
      setfilesloading(false);
    }
  }

  // Initial data fetching on component mount
  useEffect(() => {
    filefolderholder();
    getrecentlycreated();
  }, [])

  // Handles clicking outside the "New File/Folder" menu to close it
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

  // Creates a new folder
  const foldercreate = async (data) => {
    try {
      await axios.post('api/filefoldercreate', {
        filefolderdata: {
          name: data.foldername,
          userid: session.user.id,
          discription: data.folderdiscription,
          parent: currentpath.filefolderid,
          type: "folder",
          breadcrumb: Array.isArray(breadpath) ? [...breadpath] : [],
        }
      });
      getrecentlycreated();
      filefolderholder(); // Refresh  the current directory view
      reset(); // Reset form fields
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setnewfolder(false); // Close the modal regardless of success or failure
    }
  }

  // Creates a new file
  const filecreate = async (data) => {
    try {
      await axios.post('api/filefoldercreate', {
        filefolderdata: {
          name: data.filename,
          userid: session.user.id,
          discription: data.filediscription,
          parent: currentpath.filefolderid,
          type: "file",
          code: codetosave,
          language: language,
          breadcrumb: Array.isArray(breadpath) ? [...breadpath] : []
        }
      });
      // **FIX**: Refresh both the recent files list and the directory view
      getrecentlycreated();
      filefolderholder();
      reset(); // Reset form fields
      setcodetosave(null); // Clear the saved code
    } catch (error) {
      console.error("Failed to create file:", error);
    } finally {
      setinfobox(false); // Close the modal
    }
  }

  // Updates the current path when navigating into a folder
  const updatepath = async (path, name) => {
    setcurrentpath({ filefolderid: path, filefoldername: name });
    setbreadpath(prev => [...prev, { filefolderid: path, filefoldername: name }]);
    try {
      const res = await axios.post('api/getfilefolder', { path: path });
      setfiledata(res.data.files);
    } catch (error) {
      console.error("Failed to update path:", error);
    }
  }

  // Handles navigating back to the parent folder
  const handleback = async () => {
    if (breadpath.length > 1) {
      const newpath = breadpath.slice(0, -1);
      setbreadpath(newpath);
      const newCurrent = newpath[newpath.length - 1];
      setcurrentpath(newCurrent);
      await axios.post('api/getfilefolder', { path: newCurrent.filefolderid }).then(res => setfiledata(res.data.files)).catch(error => console.log(error));
    }
  }

  // Closes the info box and change path modals
  const handlecloseall = () => {
    setinfobox(false);
    setchangepath(false);
  }

  // Animation variants
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <>
      <div className='h-full flex flex-col items-center justify-start md:justify-center text-white relative backdrop-blur-xl'>

        <AnimatePresence>
          {newfile && (
            <motion.div
              initial="hidden" animate="visible" exit="exit" variants={modalVariants}
              className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center"
            >
              <Filecreateeditor infocodesave={infocodesave} language={language} options={options} setlanguage={setlanguage} setcodetosave={setcodetosave} codetosave={codetosave} setnewfile={setnewfile} />
            </motion.div>
          )}

          {infobox && (
            <motion.div
              initial="hidden" animate="visible" exit="exit" variants={modalVariants}
              className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center"
            >
              <div className='flex flex-col gap-4 border bg-zinc-900 rounded-md w-[90vw] md:w-[35vw] p-3'>
                <ImCross className='text-white text-sm hover:cursor-pointer self-end' onClick={handlecloseall} />
                <div className='flex flex-col gap-6'>
                  <form onSubmit={handleSubmit(filecreate)} id='fileform' className='flex flex-col gap-3'>
                    <Input type="text" placeholder='File Name' className='border rounded-lg p-2' {...register("filename", { required: true })} />
                    <Textarea type="text" placeholder='Description' className='border rounded-lg p-2 h-36' {...register("filediscription")} />
                  </form>
                  <p className='text-gray-400'>Current save path - {currentpath.filefoldername}</p>
                </div>
                <div className='flex justify-between'>
                  <Button form='fileform' type='submit' className='bg-teal-600 font-semibold p-1 px-6 rounded-lg text-white'>Create</Button>
                  <Button onClick={() => setchangepath(true)} className='font-semibold p-1 px-6 rounded-lg'>Change Path</Button>
                </div>
              </div>
            </motion.div>
          )}

          {recentcode && (
            <motion.div
              initial="hidden" animate="visible" exit="exit" variants={modalVariants}
              className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center"
            >
              <Editoronly key={recentcode} codetosave={recentcode} readOnly={true}>
                <Button onClick={() => setrecentcode(null)}>Close</Button>
              </Editoronly>
            </motion.div>
          )}
        </AnimatePresence>


        { 
          !filesloading ?(<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col gap-3 border-zinc-400 rounded-2xl p-6 w-full md:w-[50vw]'
          >
            <div className='flex flex-col md:flex-row gap-1 md:gap-3'>
              <p className='text-lg md:text-4xl font-mono font-bold md:font-semibold md:py-4'>Recently Added</p>
              <p className='text-2xl md:text-4xl font-mono font-semibold md:py-4'>Files</p>
            </div>
            <div>
              <motion.ul
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className='flex flex-col gap-3 overflow-y-auto h-96 w-full'
              >
                <AnimatePresence>
                  {recentlyupdated.length > 0 ? (recentlyupdated.map((file) => (
                    <motion.li
                      key={file._id}
                      variants={listItemVariants}
                      layout
                      exit={{ opacity: 0, x: -50 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setrecentcode(file.code)}
                      className='bg-zinc-800 hover:bg-zinc-700 transition-colors w-full p-3 rounded-2xl flex flex-col gap-1 cursor-pointer'
                    >
                      <p className='text-white font-semibold'>{file.name}</p>
                      <p className='text-gray-300 text-sm truncate'>Description - {file.discription}</p>
                      <p className='text-gray-400 text-xs'>Created at - {new Date(file.time).toLocaleString()}</p>
                      <div className='flex w-full items-center gap-1 mt-1'>
                        <p className='text-zinc-400 text-sm'>Location - </p>
                        <div className="flex-1 min-w-0">
                          <Breadcrumbmine breadpath={file.breadcrumb} />
                        </div>
                      </div>
                    </motion.li>
                  ))) : (
                    <motion.div variants={listItemVariants} className='flex flex-col justify-center items-center text-center p-4'>
                      <Image src={'/illustration.svg'} alt='illustration' width={300} height={300} />
                      <span className='w-full h-full text-blue-500 text-lg mt-4'>No recent files. Create one!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.ul>
            </div>
          </motion.div>):(
              <div className=' text-3xl'>loading....</div>
          )
        }

       <div className='z-50'>
        
        <Newfolder newfolder={newfolder} setnewfolder={setnewfolder} foldercreate={foldercreate} setchangepath={setchangepath} />
        {changepath && (<Changepath breadpath={breadpath} filedata={filedata} handleback={handleback} setchangepath={setchangepath} updatepath={updatepath} />)}
       </div>


        <div>
          <AnimatePresence>
            {newfilefolder && (
              <motion.div ref={newfilefolderRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ transformOrigin: "bottom right" }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className='flex flex-col gap-2 bg-zinc-800 border p-2 rounded-xl absolute right-18 bottom-18 md:right-22 md:bottom-22'>
                {/* FIX: Close menu on button click */}
                <MotionButton whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} onClick={() => { setnewfolder(true); setnewfilefolder(false); }} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New folder</MotionButton>
                <MotionButton onClick={() => { setnewfile(true); setnewfilefolder(false); }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 15 }} className={"bg-transparent border px-6 hover:bg-zinc-600 text-white"}>New file</MotionButton>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div whileTap={{ scale: 0.9 }} className='absolute bottom-0 right-0 m-6 md:m-10'>
            <Button className="bg-teal-500 rounded-full aspect-square text-black p-6 hover:bg-teal-400 " onClick={() => setnewfilefolder(prev => !prev)}>
              <FaPlus />
            </Button>
          </motion.div>
        </div>

      </div>
    </>
  )
}

export default App;