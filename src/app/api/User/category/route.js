import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Category from "../../../../../models/category.js";

export async function GET(req) {
  try {
    await connectDb();
    const search = req.nextUrl.searchParams.get("q") || "";
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const categories = await Category.find(filter)
      .select("name slug image parent")
      .sort({ name: 1 });

 

    return NextResponse.json(
      {
        message: "Categories fetched successfully",
        categories,
        
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
