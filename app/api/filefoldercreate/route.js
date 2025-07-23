import { NextResponse } from "next/server"; 
import connection from "@/lib/mongo"
import createff from "@/models/createfilefolder"


export async function POST(req) {
    connection();

  const {filefolderdata} = await req.json();

  try {
    await createff.create({
      name : filefolderdata.name,
      discription : filefolderdata.discription,
      parent : filefolderdata.parent,
      code : filefolderdata.code,
      type : filefolderdata.type
    })
console.log("succsess");

    return NextResponse.json({Messege : "got it"}, {status : 201});
  } catch (error) {
    console.log(error);
    return NextResponse.json({messege : "Man somthing wrong"}, {status : 204})
  }
}