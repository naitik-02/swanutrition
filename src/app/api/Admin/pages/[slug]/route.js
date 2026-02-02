import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Page from "../../../../../../models/page";

export async function GET(req, { params }) {
  try {
    await connectDb();
    
    const { slug } = await params; 
    
    console.log("PARAM SLUG:", slug);
    
    const page = await Page.findOne({ slug });
    
    if (!page) {
      return NextResponse.json(
        { message: "Page not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Page fetched successfully",
      data: page,
    });
    
  } catch (error) {
    console.error("Page GET single error:", error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}