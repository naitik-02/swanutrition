import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import BlogPost from "../../../../../../models/blog";

export async function GET(req, { params }) {
  try {
    await connectDb();
    const {id}  = await params ; 
    const post = await BlogPost.findById(id)
      .populate("category")
      .populate("author")

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
