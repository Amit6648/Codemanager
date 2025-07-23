import React from 'react'
import { FaRegFileCode } from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";
import Link from 'next/link';

function Navbar() {
  return (
    <div className=' absolute left-0 top-[30%] z-10 '>

       <div className=' bg-gray-600 p-4 rounded-r-2xl flex flex-col gap-8'>
            <Link href={"/"} ><FaRegFileCode className='size-6' /></Link>
            <Link href={"/folders"}><LuFolderSearch className='size-6' /></Link>
       </div>

    </div>
  )
}

export default Navbar