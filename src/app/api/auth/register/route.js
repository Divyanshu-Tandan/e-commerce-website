import userModel from "@/models/user.model.js";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Fill all fields" }, { status: 400 });
    }

    const userExist = await userModel.findOne({ 
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
