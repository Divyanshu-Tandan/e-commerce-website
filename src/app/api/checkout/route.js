import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db.js";
import cartModel from "@/models/cart.model.js";
import orderModel from "@/models/order.model.js";
import { verifyAccessToken } from "@/lib/auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const authenticate = (request) => {
  const accessToken = request.cookies.get("accessToken");
  if (!accessToken) return null;
  const decoded = verifyAccessToken(accessToken.value);
  if (!decoded || decoded.error || !decoded.id) return null;
  return decoded.id;
};

export async function POST(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddress } = await request.json();

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return NextResponse.json({ message: "Shipping address is required" }, { status: 400 });
    }

    // Fetch the user's cart
    const cart = await cartModel.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Calculate total and build Stripe line items
    let totalAmount = 0;
    const orderItems = [];
    const lineItems = [];

    for (const item of cart.items) {
      if (!item.product) continue;

      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: item.product.description?.substring(0, 200),
            images: item.product.images?.length > 0 ? [item.product.images[0]] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Create the order in our database
    const order = await orderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      deliveryStatus: "processing",
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId,
      },
    });

    // Save Stripe session ID to the order
    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url, orderId: order._id }, { status: 200 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
