'use client'
import React from 'react'
import { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { Button } from './ui/button';
import { DropdownMenu } from './ui/dropdown-menu';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';




function Filefolder({ file, i, rename, renametrue, filefolderedit, updatepath, handledialogdata }) {


    return (


        <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-yellow-700"} border flex  justify-between items-center text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-yellow-600 h-full `} onDoubleClick={() => updatepath(file._id, file.name)}>
            <div className='w-[90%]'>

                <p>{file.name}</p>
                <p className='text-sm text-gray-300 truncate w-full' key={i}> discription - {file.discription}</p>
                <p> file type - {file.type}</p>
            </div>

            <div className='relative h-full  '>
               <DropdownMenu >
                <div className=' h-full flex items-end '>
                    <DropdownMenuTrigger asChild>
                        <BsThreeDots className='text-xl' onClick={() => setbox(prev => !prev)} />
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

export default Filefolder

