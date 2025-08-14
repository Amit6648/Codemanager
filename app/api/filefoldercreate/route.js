import { NextResponse } from "next/server";
import connection from "@/lib/mongo"
import createff from "@/models/createfilefolder"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";




export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  try {
    connection();
    const { filefolderdata } = await req.json();
    console.log(filefolderdata);
    await createff.create({
      name: filefolderdata.name,
      userid: session.user.id,
      discription: filefolderdata.discription,
      parent: filefolderdata.parent,
      code: filefolderdata.code,
      type: filefolderdata.type,
      language: filefolderdata.language,
      breadcrumb: filefolderdata.breadcrumb,


    })
    console.log("succsess");

    return NextResponse.json({ Messege: "got it" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ messege: "Man somthing wrong" }, { status: 204 })
  }
}