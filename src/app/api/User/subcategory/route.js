import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Subcategory from "../../../../../models/subcategory.js";
import Category from "../../../../../models/category.js";

export async function GET() {
  try {
    await connectDb();

    const subcategories = await Subcategory.find().populate("category");

    return NextResponse.json(
      {
        message: "Subcategories fetched successfully",
       subcategories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
