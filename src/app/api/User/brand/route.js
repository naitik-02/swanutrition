import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Brand from "../../../../../models/brand";

export async function GET() {
  try {
    await connectDb();

    const brands = await Brand.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Brands fetched successfully",
        data: brands,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Brand GET error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
