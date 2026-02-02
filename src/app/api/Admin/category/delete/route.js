import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Category from "../../../../../../models/category.js";
import Subcategory from "../../../../../../models/subcategory.js";
import Product from "../../../../../../models/product.js";
import CheckAuth from "../../../../../../middlewares/isAuth.js";

export async function DELETE(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // if (!admin.permissions.includes("manage_product_categories")) {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    // }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await Subcategory.deleteMany({ category: id });
    await Product.deleteMany({ category: id });

    await logActivity(admin, "DETELETE_CATEGORY", `delete category: ${id}`);

    return NextResponse.json(
      {
        message:
          "Category and related subcategories/products deleted successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
