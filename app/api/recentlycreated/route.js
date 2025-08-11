import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server"; 
import Folder from "@/models/createfilefolder";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    try {
        await mongoconnect();
        console.log(session.user.id);
        
        const folders = await Folder.find({type: "file", userid : session.user.id}).sort({ time: -1 }).limit(5);
        return NextResponse.json(folders);
    } catch (error) {
        console.error("Error fetching recently created folders:", error);
        return NextResponse.json({ error: "Failed to fetch recently created folders" }, { status: 500 });
    }
}