import React from 'react'
import { useForm } from 'react-hook-form'

import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Button } from './ui/button'

function Rename({
    saverename,
    rename,
    setrenametrue,
    
}) {

    const {
        register,
        handleSubmit,
        reset, // <-- add this
        watch,
        formState: { errors },
    } = useForm()

  return (
      <div className='  m-auto rounded-md p-6 flex flex-col gap-4 text-white absolute top-[50%] left-[50%] transform -translate-y-1/2 -translate-x-1/2 backdrop-blur-2xl bg-black/80 w-76 border border-zinc-600'>
    
                            <form id='renameform' className='flex flex-col gap-2.5' onSubmit={handleSubmit(saverename)}>
    
                                <p className=' flex flex-col gap-1.5 '>
                                    <Label>Name</Label>
                                   <Input type="text" defaultValue={rename.name} {...register("name")} />
                                </p>
                                <p className='flex flex-col gap-1.5'>
                                    <Label>Discription</Label>
                                    <Textarea  className={"h-38"} type="text" defaultValue={rename.discription} {...register("discription")} />
                                </p>
                            </form>
    
    
                            <div className='flex justify-between '>
                                <Button className={"bg-transparent border border-zinc-400 font-semibold text-white hover:text-black"  } onClick={() => setrenametrue(false)}>close</Button>
                                <Button type='submit' form='renameform' className='bg-white p-1 px-3 rounded-sm font-semibold'>Save Changes</Button>
                            </div>
                        </div>
  )
}

export default Rename