
import { NextResponse } from "next/server";
import BlogSubCategory from "../../../../../../../models/blogSubcategory";
import { connectDb } from "../../../../../../database";

export async function GET() {
  try {
    await connectDb();
    const subcategories = await BlogSubCategory.find().populate("parentCategory").sort({ createdAt: -1 });
    return NextResponse.json({ data: subcategories });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}