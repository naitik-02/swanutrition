// app/api/admin/cms/top-categories/add/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import TopCategory from "../../../../../../../models/top-categories";
import Category from "../../../../../../../models/category";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function POST(req) {
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

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { message: "Category IDs array is required" },
        { status: 400 }
      );
    }

    // Validate that all categories exist
    const existingCategories = await Category.find({
      _id: { $in: categoryIds },
    });

    if (existingCategories.length !== categoryIds.length) {
      return NextResponse.json(
        { message: "One or more categories not found" },
        { status: 400 }
      );
    }

    // Check if top categories document exists
    let topCategoryDoc = await TopCategory.findOne();

    if (topCategoryDoc) {
      // Add new categories to existing array (avoid duplicates)
      const uniqueCategories = [...new Set([...topCategoryDoc.categories, ...categoryIds])];
      topCategoryDoc.categories = uniqueCategories;
      await topCategoryDoc.save();
    } else {
      // Create new top categories document
      topCategoryDoc = await TopCategory.create({
        categories: categoryIds,
      });
    }

    // ✅ Populate only specific fields
    await topCategoryDoc.populate({
      path: "categories",
      select: "name slug image", // only return these fields
    });

    return NextResponse.json(
      {
        message: "Categories added to top categories successfully",
        data: topCategoryDoc,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("ADD TOP CATEGORIES ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
