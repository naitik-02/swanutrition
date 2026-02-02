import { connectDb } from "@/database";
import Product from "../../../../../models/product";
import herosection from "../../../../../models/herosection";
import Category from "../../../../../models/category";
import { NextResponse } from "next/server";
import video from "../../../../../models/video";
import blog from "../../../../../models/blog";

export async function GET(req) {
  try {
    await connectDb();

    const [
      bestseller,
      supersaver,
      newlaunches,
      hero,
      categories,
      videos,
      blogs,
    ] = await Promise.all([
      Product.find({ isBestSeller: true }).limit(8),
      Product.find({ isSuperSaver: true }).limit(8),
      Product.find({ isNewLaunch: true }).limit(8),
      herosection.find(),
      Category.find(),
      video.find({ isActive: true }).populate("product"),
      blog.find({ status: "published" }),
    ]);

    return NextResponse.json({
      message: "success",
      data: {
        bestseller,
        supersaver,
        newlaunches,
        hero,
        categories,
        videos,
        blogs,
      },
    });
  } catch (error) {
    NextResponse.josn({
      message: error.message,
    });
  }
}
