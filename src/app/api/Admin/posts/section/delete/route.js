import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import BlogPost from "../../../../../../../models/blog";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function DELETE(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!admin.permissions.includes("update_posts")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { postId, sectionId } = await req.json();

    if (!postId || !sectionId) {
      return NextResponse.json({ message: "IDs required" }, { status: 400 });
    }

    const post = await BlogPost.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const section = post.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    section.deleteOne();
    await post.save();

    return NextResponse.json(
      { message: "Section deleted", data: post },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete section error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
