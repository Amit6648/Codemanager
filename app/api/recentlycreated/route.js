import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server"; 
import Folder from "@/models/createfilefolder";

export async function GET() {
    try {
        await mongoconnect();
        const folders = await Folder.find({type: "file"}).sort({ time: -1 }).limit(5);
        return NextResponse.json(folders);
    } catch (error) {
        console.error("Error fetching recently created folders:", error);
        return NextResponse.json({ error: "Failed to fetch recently created folders" }, { status: 500 });
    }
}