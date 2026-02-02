import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Tag from "../../../../../../models/tag";

export async function GET() {
  try {
    await connectDb();

    const tags = await Tag.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: tags }, { status: 200 });
  } catch (error) {
    console.error("Tags GET error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
