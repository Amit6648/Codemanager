"use client"
import { useState, useEffect, useRef } from 'react'
import Editor from "@monaco-editor/react";
import { useForm } from "react-hook-form"
import axios from 'axios';
import { ImCross } from "react-icons/im";
import { Sidebar, SidebarContent, SidebarProvider, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { FaRegFileCode } from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";

function App() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

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


  //to save code and set infobox state
  const infocodesave = (codeid) => {

    setcodetosave(saved[codeid])

    setinfobox(prev => !prev);
  }

  //to fetch folders

  useEffect(() => {
    filefolderholder();
  }, [])


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
      <div className='  min-h-screen  w-screen flex flex-col items-center justify-center bg-black text-white  py-10 relative '>

        <SidebarProvider className='absolute top-0'>
         
          <Sidebar>
            
            <SidebarContent className='flex flex-col gap-4 p-4 '>
              <SidebarMenu className="bg-muted rounded-xl p-2">
                <SidebarMenuButton>
                  <div className='flex gap-2 items-center justify-center'>
                    <FaRegFileCode />
                    <p>Code editor</p>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuButton>
                  <div className='flex gap-2 items-center justify-center'>
                    <LuFolderSearch />
                    <p>Folders</p>
                  </div>
                </SidebarMenuButton>
              </SidebarMenu>


            </SidebarContent>
          </Sidebar>
 <SidebarTrigger />
        </SidebarProvider>
        <div className='flex items-center gap-5'>

          <div className='flex flex-col gap-4 '>
            <select className=' border  bg-gray-700  ' value={language} onChange={e => setlanguage(e.target.value)}>
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
            </div>
            <div className='flex gap-2.5'>

              <button onClick={handleonsubmit} className='bg-blue-500 w-17.5 h-6.5 rounded-lg border-b-2  font-semibold text-white'>
                Submit
              </button>
              <button onClick={() => infocodesave("original")} className='bg-green-500 w-17.5 h-6.5 rounded-l text-white font-bold'> Save</button>
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


        {

          newfolder && (<div className='z-20 bg-gray-700 p-3 rounded-xl'>

            <form className='flex flex-col gap-4' onSubmit={handleSubmit(foldercreate)} >

              <div className='flex flex-col gap-6  '>

                <input className='border p-2' placeholder='folder Name' {...register("foldername")} />
                <input className='border p-2' type="text" placeholder='discription' {...register("folderdiscription")} />
              </div>
              <button type='submit' className='bg-blue-400 p-1 px-4 rounded-lg'>submit</button>
            </form>
            <div>

            </div>



          </div>)
        }


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


      </div>
    </>
  )
}

export default App
