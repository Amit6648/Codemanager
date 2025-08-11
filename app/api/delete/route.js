
import { NextResponse } from "next/server";
import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";

mongoconnect();
export async function POST(request) {

    try {
        const reqBody = await request.json();
        const { id } = reqBody;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }


        const deletedItem = await Folder.findByIdAndDelete(id);
        const childdelteditems = await Folder.deleteMany({ parent: id });





        if (!deletedItem) {
            console.log("somthing wrong");

            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

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