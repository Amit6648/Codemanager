import React from 'react'
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu } from './ui/dropdown-menu';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

function File({ file, i, rename, renametrue, filefolderedit, opencode, handledialogdata }) {
    return (
        <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-blue-700"} border flex justify-between items-center text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-blue-600 `} onDoubleClick={() => opencode(file.code, file._id)}  >
            <div>

                <p>{file.name}</p>
                <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
                <p> file type - {file.type}</p>
            </div>

 <div className='relative h-full '>
               <DropdownMenu>
                <div className=' h-full flex items-end '>
                    <DropdownMenuTrigger asChild>
                        <BsThreeDots size={20}/>
                    </DropdownMenuTrigger>
                </div>
                    <DropdownMenuContent className=" text-white">
                       <DropdownMenuItem onClick={() => filefolderedit(file._id, file.name, file.discription)}>
                        Edit
                       </DropdownMenuItem>
                       <Separator/>
                       <DropdownMenuItem onClick={() => handledialogdata(file)} >
                        Delete
                       </DropdownMenuItem>
                        <Separator/>

                    </DropdownMenuContent>
               </DropdownMenu>
            </div>

        </div>
    )
}

export default File