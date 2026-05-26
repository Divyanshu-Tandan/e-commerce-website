import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import cartModel from "@/models/cart.model.js";
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

    let cart = await cartModel.findOne({ user: userId }).populate("items.product");
    
    if (!cart) {
      cart = await cartModel.create({ user: userId, items: [] });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = authenticate(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { productId, quantity, action } = await request.json(); // action can be 'add', 'update', 'remove'
    if (!productId) return NextResponse.json({ message: "Product ID required" }, { status: 400 });

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await cartModel.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (action === "remove") {
      if (itemIndex > -1) {
        cart.items.splice(itemIndex, 1);
      }
    } else if (action === "update") {
      if (itemIndex > -1 && quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      }
    } else { // default add
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    
    // return populated cart
    cart = await cartModel.findById(cart._id).populate("items.product");

    return NextResponse.json({ cart, message: "Cart updated" }, { status: 200 });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
