import { NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth.js";
import connectDB from "@/lib/db.js";
import userModel from "@/models/user.model.js";

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token provided" }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken.value);

    if (!decoded || decoded.error || !decoded.id) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    await connectDB();
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newAccessToken = user.generateAccessToken();

    const response = NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });

    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
