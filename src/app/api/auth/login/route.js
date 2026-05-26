import userModel from "@/models/user.model.js";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    if ((!username && !email) || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 },
      );
    }

    const user = await userModel.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!(await user.matchPassword(password))) {
      return NextResponse.json(
        { message: "Invalid crendentials" },
        { status: 401 },
      );
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })

    const response = NextResponse.json(
      {
        message: "Login successful",
      },
      {
        status: 200
      }
    )

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60
    })

    return response
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
