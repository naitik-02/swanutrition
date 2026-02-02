import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import blog from "../../../../../../models/blog";
import blogCategory from "../../../../../../models/blogCategory";
import blogSubcategory from "../../../../../../models/blogSubcategory";
import user from "../../../../../../models/user";

export async function GET() {
  try {
    await connectDb();
    const posts = await blog.find()
      .populate("category")
     
      .populate("author");
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
