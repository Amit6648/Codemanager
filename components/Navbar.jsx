'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Folder, User, Settings, LogOut, Search, Code2 } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <Sidebar variant='inset'>
        <TooltipProvider>
          {/* The background classes have been updated here */}
          <SidebarContent className='flex flex-col gap-4 p-4 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10'>

            <div className="px-2 py-1">
              <Code2 className="size-7 text-white" />
            </div>

            {/* The solid background was removed here to blend with the parent */}
            <SidebarMenu className="rounded-xl p-2 flex-grow">
              <Link href="/home">
                <SidebarMenuButton
                  className={cn(
                    "hover:bg-white/10 justify-start",
                    pathname === "/home" && "bg-primary text-primary-foreground hover:bg-zinc-500"
                  )}
                >
                  <Home className="size-5 mr-2" />
                  <span>Home</span>
                </SidebarMenuButton>
              </Link>

              <Link href="/folders">
                <SidebarMenuButton
                  className={cn(
                    "hover:bg-white/10 justify-start",
                    pathname === "/folders" && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                >
                  <Folder className="size-5 mr-2" />
                  <span>Folders</span>
                </SidebarMenuButton>
              </Link>


            </SidebarMenu>

            {/* The solid background was removed here as well */}
            {/* User Profile & Settings Section with Visible Text */}
            <div className="mt-auto rounded-xl p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* 1. This div is now a flex container */}
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                    {/* 2. The Avatar */}
                    {session?.user && ( // Check if user exists
                      <Avatar className="size-8">
                        {/* This will now work correctly */}
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />


                        {/* A dynamic fallback using the user's initials */}
                        <AvatarFallback>
                          {session.user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* 3. The added text */}
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white">{session.user.name}</span>

                    </div>
                  </div>
                </DropdownMenuTrigger>
                {/* The DropdownMenuContent stays the same */}
                <DropdownMenuContent side="right" align="end" className="text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut('google')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarContent>
        </TooltipProvider>
      </Sidebar>
    )
  }

  if (status === 'unauthenticated') {
    return (<div>
      denied
    </div>)
  }
}

export default Navbar