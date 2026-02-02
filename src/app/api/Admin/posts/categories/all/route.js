import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import BlogCategory from "../../../../../../../models/blogCategory";

export async function GET() {
  try {
    await connectDb();
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}