import React from 'react'
import Link from 'next/link'
import { SigninForm } from '@/components/Signin-Form'


function page() {
  return (
    <div className=' w-full h-screen flex items-center justify-center backdrop-blur-2xl'>
        <SigninForm/>
    </div>
  )
}

export default page