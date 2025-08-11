import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CustomTrigger } from "@/components/ui/CustomTrigger";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Code manager",
  description: "Store the code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark ">

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex font-mono` } 
      >

        <SidebarProvider>
          <Navbar />
          <SidebarInset  >
            <CustomTrigger  />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
