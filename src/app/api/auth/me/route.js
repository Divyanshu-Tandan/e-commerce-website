import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import userModel from "@/models/user.model.js";

export async function GET(request) {
    try {
        await connectDB();
        const userId = request.headers.get('x-user-id')
        
        if (!userId) {
            return NextResponse.json({ user: null, message: "Not authenticated" }, { status: 200 });
        }
        
        const user = await userModel.findById(userId).select('-password -refreshToken')
        return NextResponse.json({
            user,
            message: "User fetched successfully"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}