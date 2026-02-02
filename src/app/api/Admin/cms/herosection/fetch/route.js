import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import HeroSection from "../../../../../../../models/herosection";
import Category from "../../../../../../../models/category";

export async function GET() {
  try {
    await connectDb();

    const sliders = await HeroSection.find().populate("category")
    .sort({ order: 1 });

    console.log(sliders)

    return NextResponse.json({ data: sliders }, { status: 200 });
  } catch (error) {
    console.error("FETCH SLIDERS ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
