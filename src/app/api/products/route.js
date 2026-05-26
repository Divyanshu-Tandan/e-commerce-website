import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import productModel from "@/models/product.model.js";
import userModel from "@/models/user.model.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const products = await productModel.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

import { verifyAccessToken } from "@/lib/auth.js";

export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication and authorization using cookies
    const accessToken = request.cookies.get("accessToken");
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decoded = verifyAccessToken(accessToken.value);
    if (!decoded || decoded.error || !decoded.id) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, images, category, stockCount } = body;

    if (!name || !description || price === undefined || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      images: images || [],
      category,
      stockCount: stockCount || 0,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
