
'use client';
import { useSidebar } from "@/components/ui/sidebar";

import { GoSidebarExpand } from "react-icons/go";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div className="flex items-center ">
   
    <button
      onClick={toggleSidebar}
      className=" p-3  "
      >
        
        { open?(
          
          <GoSidebarExpand className="text-white text-2xl hover:text-zinc-300 " />
        ):(
          <GoSidebarExpand className="text-white text-2xl hover:text-zinc-300 rotate-180" />
        )
        
        
      }
    </button>

      </div>
  );
}
