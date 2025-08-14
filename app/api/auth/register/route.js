// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import mongoconnect from "@/lib/mongo";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        
        if (!name || !email || !password) {

            
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        await mongoconnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User created successfully." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}