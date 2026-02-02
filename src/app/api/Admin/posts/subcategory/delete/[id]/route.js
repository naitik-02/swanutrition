import { NextResponse } from "next/server";
import BlogSubCategory from "../../../../../../../../models/blogSubcategory";
import { connectDb } from "../../../../../../../database";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

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
    await BlogSubCategory.findByIdAndDelete(id);

    await logActivity(
      admin,
      "DELETE_ADDED",
      `deleted subcategory: ${params.id}`
    );

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
