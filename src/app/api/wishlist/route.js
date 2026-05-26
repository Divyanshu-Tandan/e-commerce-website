import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import userModel from "@/models/user.model.js";
import { verifyAccessToken } from "@/lib/auth.js";
import productModel from "@/models/product.model.js";

const authenticate = (request) => {
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken) return null;
  const decoded = verifyAccessToken(accessToken.value);
  if (!decoded || decoded.error || !decoded.id) return null;
  return decoded.id;
};

export async function GET(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await userModel.findById(userId).populate("wishlist");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { productId, action } = await request.json(); // action: 'add' or 'remove'
    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    const user = await userModel.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const wishlistIndex = user.wishlist.indexOf(productId);

    if (action === "remove") {
      if (wishlistIndex > -1) {
        user.wishlist.splice(wishlistIndex, 1);
      }
    } else { // add
      if (wishlistIndex === -1) {
        user.wishlist.push(productId);
      }
    }

    await user.save({ validateBeforeSave: false });

    // Return populated wishlist
    const populatedUser = await userModel.findById(userId).populate("wishlist");

    return NextResponse.json({ wishlist: populatedUser.wishlist, message: "Wishlist updated" }, { status: 200 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
