import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
function Changepath({breadpath, filedata, setchangepath, handleback, updatepath}) {
      const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
  return (
<div className='border p-5 rounded-2xl flex flex-col gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 w-[50vw] md:w-[30vw] z-30'>
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
        </div>
        

        )
    }

export default Changepath