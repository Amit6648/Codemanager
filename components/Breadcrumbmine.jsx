import React from 'react'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function Breadcrumbmine({

    breadpath,
    handlecrumbclick,


}) {

    const firstitem = breadpath[0];
    const lastitem = breadpath[breadpath.length - 1];
    const middlelements = breadpath.slice(1, -1);
    const maxlen = 1;


    return (
        <div>

            { breadpath.length > maxlen ?
            (

                
                <ul className=' text-white  ' >

                    <Breadcrumb className="hover:cursor-pointer">
                        <BreadcrumbList>
                          <BreadcrumbItem onClick={() => handlecrumbclick(firstitem.index)}>
                                {firstitem.filefoldername}
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                /
                            </BreadcrumbSeparator>
                              
                            <DropdownMenu>
                                <DropdownMenuTrigger className='focus:outline-none hover:cursor-pointer hover:text-white'>
                                    <BreadcrumbEllipsis/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='bg-zinc-700 rounded-md p-1 '>
                                    {middlelements.map((path, i) => (
                                        <React.Fragment key={i}>
                                          <DropdownMenuItem className=' focus:outline-none hover:bg-zinc-500 rounded-md p-1 hover:text-white' onClick={() => handlecrumbclick(path.index)}>
                                            {path.filefoldername}

                                          </DropdownMenuItem>
                                          
                                        </React.Fragment>
                                    ))}
                                </DropdownMenuContent>
                                
                            </DropdownMenu>
                               <BreadcrumbSeparator>
                                /
                            </BreadcrumbSeparator>
                             <BreadcrumbItem className={"truncate"} onClick={() => handlecrumbclick(lastitem.index)}>
                                {lastitem.filefoldername}
                            </BreadcrumbItem>

                        </BreadcrumbList>
                    </Breadcrumb>

                </ul>
            
        ):(
             <ul className=' text-white  ' >

                    <Breadcrumb className="hover:cursor-pointer">
                        <BreadcrumbList>
                            {breadpath.map((path, i) => (
                                <React.Fragment key={i}>

                                    <BreadcrumbItem onClick={() => handlecrumbclick(path.index)}>
                                        {path.filefoldername}
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        /
                                    </BreadcrumbSeparator>
                                </React.Fragment>
                            ))}

                        </BreadcrumbList>
                    </Breadcrumb>

                </ul>
        )
        }
        </div>
    )
}

export default Breadcrumbmine