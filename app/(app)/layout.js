
import Navbar from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CustomTrigger } from "@/components/ui/CustomTrigger";

export const metadata = {
  title: "Code manager",
  description: "Store the code",
};

export default function AppLayout({ children }) {
  return (


    <SidebarProvider>
      <Navbar />
      <SidebarInset  >
        <CustomTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>

  );
}
