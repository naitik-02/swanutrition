// app/api/admin/cms/top-categories/update/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import TopCategory from "../../../../../../../models/top-categories";
import Category from "../../../../../../../models/category";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function PUT(req) {
  try {
    await connectDb();
    
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // if (!admin.permissions.includes("manage_categories")) {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    // }

    const { categoryIds } = await req.json();

    if (!categoryIds || !Array.isArray(categoryIds)) {
      return NextResponse.json(
        { message: "Category IDs array is required" },
        { status: 400 }
      );
    }

          if (categoryIds.length > 0) {
      const existingCategories = await Category.find({
        _id: { $in: categoryIds },
      });

      if (existingCategories.length !== categoryIds.length) {
        return NextResponse.json(
          { message: "One or more categories not found" },
          { status: 400 }
        );
      }
    }

    let topCategoryDoc = await TopCategory.findOne();

    if (topCategoryDoc) {
      topCategoryDoc.categories = categoryIds;
      await topCategoryDoc.save();
    } else {
      topCategoryDoc = await TopCategory.create({
        categories: categoryIds,
      });
    }

   await topCategoryDoc.populate("categories");


return NextResponse.json(
  { message: "Top categories updated successfully", data: freshData },
  { status: 200 }
);
  } catch (error) {
    console.error("UPDATE TOP CATEGORIES ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
