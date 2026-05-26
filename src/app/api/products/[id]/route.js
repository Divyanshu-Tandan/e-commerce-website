import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import productModel from "@/models/product.model.js";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await productModel.findById(id);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
