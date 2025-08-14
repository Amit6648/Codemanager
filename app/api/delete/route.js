
import { NextResponse } from "next/server";
import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        mongoconnect();
        const reqBody = await request.json();
        const { id } = reqBody;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }


        const deletedItem = await Folder.deleteOne({ _id: id, userid: session.user.id });
        
        if (deletedItem.deletedCount===0) {
            console.log("somthing wrong");
            
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        const childdelteditems = await Folder.deleteMany({ parent: id, userid: session.user.id });

        return NextResponse.json({
            message: "Item deleted successfully",
            success: true,
            deletedItem,
            childdelteditems
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}