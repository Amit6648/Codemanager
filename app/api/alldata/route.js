import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
       mongoconnect();
    try {
        const data =  await Folder.find({type : "file"});
        return NextResponse.json({data : data}, {status:201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"there is a problem"})
    }
}