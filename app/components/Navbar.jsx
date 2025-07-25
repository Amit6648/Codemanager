import React from 'react'
import { FaRegFileCode } from "react-icons/fa";
import { LuFolderSearch } from "react-icons/lu";
import Link from 'next/link';
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuButton, } from '@/components/ui/sidebar';
import { CustomTrigger } from '@/components/ui/CustomTrigger';

function Navbar() {
  return (



    <Sidebar variant='inset'>
      <SidebarContent className='flex flex-col gap-4 p-4 '>
        <SidebarMenu className="bg-muted rounded-xl p-2">
          <Link href="/">
          <SidebarMenuButton className="hover:bg-slate-600">
            <div className='flex gap-2 items-center justify-center'>
              <FaRegFileCode />
              <p>Files</p>
            </div>
          </SidebarMenuButton>
          </Link>
          <Link href="/folders">
          <SidebarMenuButton className="hover:bg-slate-600">
            <div className='flex gap-2 items-center justify-center'>
              <LuFolderSearch />
              <p>Folders</p>
            </div>
          </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarContent>
        
    </Sidebar >

  




  )
}

export default Navbar