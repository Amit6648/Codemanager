import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";




export async function GET() {
    const session = await getServerSession(authOptions);
     if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    try {
        mongoconnect();
        const data =  await Folder.find({type : "file", userid : session.user.id});
        return NextResponse.json({data : data}, {status:201})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"there is a problem"})
    }
}