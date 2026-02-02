// app/api/admin/cms/top-categories/fetch/route.js
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import TopCategory from "../../../../../../../models/top-categories";

export async function GET(req) {
  try {
    await connectDb();



    const topCategories = await TopCategory.findOne()
      .populate({
        path: "categories",
        select: "name slug image parent", 
      });

    const data = topCategories?.categories || [];


    return NextResponse.json(
      {
        data,
        message: "Top categories fetched successfully (from DB)",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("FETCH TOP CATEGORIES ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
