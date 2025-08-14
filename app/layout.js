import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})


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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased flex font-mono` } 
      >


            <Providers>
            {children}
            </Providers>
  
      </body>
    </html>
  );
}
