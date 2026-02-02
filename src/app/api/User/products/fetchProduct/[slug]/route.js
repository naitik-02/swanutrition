import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Product from "../../../../../../../models/product";
import Category from "../../../../../../../models/category";
import Subcategory from "../../../../../../../models/subcategory";
import Brand from "../../../../../../../models/brand";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const { slug } = await params;

    const product = await Product.findOne({ slug }).populate(
      "category subcategory brand"
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    product.views += 1;

    await product.save();

    const similarQuery = {
      _id: { $ne: product._id },
      $or: [],
    };

    if (product.subcategory) {
      similarQuery.$or.push({ subcategory: product.subcategory._id });
    }

    if (product.category) {
      similarQuery.$or.push({ category: product.category._id });
    }

    const similarProducts = await Product.find(similarQuery)
      .limit(10)
      .populate("category subcategory brand");

    return NextResponse.json(
      {
        message: "Product fetched successfully",
        product,
        similarProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
