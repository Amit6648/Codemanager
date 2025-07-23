
import connect from "@/lib/mongo"
import getff from "@/models/createfilefolder"
import { NextResponse } from "next/server";

export async function POST(req)
{
  connect();


 const {path} = await req.json();

 try {
     const data = await getff.find({parent : path})

     return NextResponse.json({files : data}, {status : 200})
 } catch (error) {
    console.log("hey there is a error", error);

    return NextResponse.json({messege : "somthing worng"}, {status : 204})
    
 }
 


}