// app/api/blog-categories/[id]/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import BlogCategory from "../../../../../../../../models/blogCategory";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "@/utils/logActivity";

export async function PUT(req, { params }) {
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

    const formData = await req.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");

    const updated = await BlogCategory.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );


       await logActivity(admin, "UPDATE_POST_CATEGORY", `update post category ${id}`);


    return NextResponse.json({ message: "Updated", data: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
