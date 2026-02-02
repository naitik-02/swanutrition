import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import BlogPost from "../../../../../../../models/blog";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function DELETE(req, { params }) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_post_categories")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }


    const {id} = await params;
    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await logActivity(
      admin,
      "DELETED_POST_CATEGORY",
      `deleted post category: ${params.id}`
    );

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
