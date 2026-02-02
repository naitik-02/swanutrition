// app/api/blog-categories/[id]/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import BlogCategory from "../../../../../../../../models/blogCategory";
import CheckAuth from "../../../../../../../../middlewares/isAuth";

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

    const { id } = params;
    await BlogCategory.findByIdAndDelete(id);

    await logActivity(
      admin,
      "DELETE_POST_CATEGORY",
      `delete post category ${id}`
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
