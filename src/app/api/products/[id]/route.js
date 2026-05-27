import { NextResponse } from "next/server";
import connectDB from "@/lib/db.js";
import productModel from "@/models/product.model.js";
import userModel from "@/models/user.model.js";
import { verifyAccessToken } from "@/lib/auth.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url) {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    let publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
    const dotIndex = publicIdWithExt.lastIndexOf('.');
    if (dotIndex !== -1) {
      publicIdWithExt = publicIdWithExt.substring(0, dotIndex);
    }
    return publicIdWithExt;
  } catch (error) {
    return null;
  }
}
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

export async function PUT(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();
    
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = await params;
    
    const product = await productModel.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.error("Failed to delete image from Cloudinary:", cloudErr);
            // Continue deleting the product even if image deletion fails
          }
        }
      }
    }

    await productModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
