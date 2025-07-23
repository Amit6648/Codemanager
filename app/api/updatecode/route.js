import mongoconnect from "@/lib/mongo";
import Folder from "@/models/createfilefolder";
import { NextResponse } from "next/server";

export async function POST(req) {
    mongoconnect();
  const {id, code} = await req.json();
  
  try {

    await Folder.findByIdAndUpdate(id, {code : code})

    

    return NextResponse.json({"done" : "Updated"}, {status : 200})
    
  } catch (error) {
    console.log(error, "there is somthing wrong");

    return NextResponse.json({error : error})
    
  }




}