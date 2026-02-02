import { NextResponse } from "next/server";
import BlogSubCategory from "../../../../../../../../models/blogSubcategory";
import { connectDb } from "../../../../../../../database";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

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
    const body = await req.json();
    const updated = await BlogSubCategory.findByIdAndUpdate(id, body, {
      new: true,
    });

    await logActivity(
      admin,
      "UPDATE_SUBCATEGORY",
      ` updated subcategory : ${id}`
    );

    return NextResponse.json({ message: "Updated", data: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
