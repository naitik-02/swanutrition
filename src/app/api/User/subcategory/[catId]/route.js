import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Subcategory from "../../../../../../models/subcategory.js";
import Category from "../../../../../../models/category.js";
import { CategoryProvider } from "@/context/category";

export async function GET(req) {
  try {
    await connectDb();

    const {catId} = req.params

    const subcategories = await Subcategory.find(CategoryProvider)

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
