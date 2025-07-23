import Folder from "@/models/createfilefolder";
import mongoconnect from "@/lib/mongo";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        mongoconnect();

        const {name,  discription, id} = await req.json();

        await Folder.findByIdAndUpdate(id, {name : name, discription : discription, id : id});

        console.log(id, name, discription);
        

        return NextResponse.json({"done" : "updated"}, {status : 200});

    } catch (error) {
        console.log( "somthing went wrong", error);

    return NextResponse.json({"done" : "somthing worng"}, {status : 204});
        
    }
}