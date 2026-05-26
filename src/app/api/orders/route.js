import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import orderModel from "@/models/order.model.js";
import cartModel from "@/models/cart.model.js";
import { verifyAccessToken } from "@/lib/auth.js";

const authenticate = (request) => {
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken) return null;
  const decoded = verifyAccessToken(accessToken.value);
  if (!decoded || decoded.error || !decoded.id) return null;
  return decoded.id;
};

// GET: Fetch user's order history
export async function GET(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const orders = await orderModel
      .find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST: Confirm an order after Stripe payment success
export async function POST(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { orderId, sessionId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 });
    }

    const order = await orderModel.findOne({ _id: orderId, user: userId });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Mark payment as completed
    order.paymentStatus = "completed";
    await order.save();

    // Clear the user's cart after successful payment
    await cartModel.findOneAndUpdate({ user: userId }, { items: [] });

    return NextResponse.json({ order, message: "Order confirmed" }, { status: 200 });
  } catch (error) {
    console.error("Order confirm error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
