import React from 'react'
import { AnimatePresence, motion, scale } from "motion/react"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RxCross2 } from "react-icons/rx";
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form"

function Newfolder({newfolder, setnewfolder, setchangepath, foldercreate}) {

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm()
  return (
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

  )
}

export default Newfolder