import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Subcategory from "../../../../../../models/subcategory.js";
import Product from "../../../../../../models/product.js";
import CheckAuth from "../../../../../../middlewares/isAuth.js";
import { logActivity } from "../../../../../utils/logActivity";

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

    const existingSubcategory = await Subcategory.findById(id);
    if (!existingSubcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }

    await Subcategory.findByIdAndDelete(id);

    await Product.deleteMany({ Subcategory: id });

    await logActivity(
      admin,
      "DELETE_PRODUCT_SUBCATEGORY",
      `deleted product Subcategory: ${id}`
    );

    return NextResponse.json(
      {
        message: "Subcategory deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
