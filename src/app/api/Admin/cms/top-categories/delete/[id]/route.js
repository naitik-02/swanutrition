// app/api/admin/cms/top-categories/delete/[id]/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import TopCategory from "../../../../../../../../models/top-categories";
import CheckAuth from "../../../../../../../../middlewares/isAuth";

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // optional: permission check
    // if (!admin.permissions.includes("manage_categories")) {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    // }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const topCategoryDoc = await TopCategory.findOne();

    if (!topCategoryDoc) {
      return NextResponse.json(
        { message: "No top categories found" },
        { status: 404 }
      );
    }

    topCategoryDoc.categories = topCategoryDoc.categories.filter(
      (cat) => cat.toString() !== id
    );

    await topCategoryDoc.save();

    await topCategoryDoc.populate("categories");

    const freshData = topCategoryDoc.categories;

    return NextResponse.json(
      {
        message: "Category removed from top categories successfully",
        data: freshData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE FROM TOP CATEGORIES ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
