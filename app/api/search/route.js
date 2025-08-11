import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const session = await getServerSession(authOptions);



export async function POST(req) {
    await mongoconnect();

    try {
        const search = await req.json();

        const data = await Folder.find({ name: { $regex: search.searchstring, $options: 'i' }, userid: session.user.id })

        return NextResponse.json({ data });





    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });


    }
}
