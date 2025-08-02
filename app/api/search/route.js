import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req) {
    await mongoconnect();

    try {
        const search = await req.json();

        const data = await Folder.find({ name: { $regex: search.searchstring, $options: 'i' } })

        return NextResponse.json({ data });





    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });


    }
}
