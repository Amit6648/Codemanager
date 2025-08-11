
import connect from "@/lib/mongo"
import getff from "@/models/createfilefolder"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req)
{

   const session = await getServerSession(authOptions);
  connect();


 const {path} = await req.json();

 try {
     const data = await getff.find({parent : path, userid : session.user.id})

     return NextResponse.json({files : data}, {status : 200})
 } catch (error) {
    console.log("hey there is a error", error);

    return NextResponse.json({messege : "somthing worng"}, {status : 204})
    
 }
 


}