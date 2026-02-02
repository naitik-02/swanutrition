import { connectDb } from "../../../../../database";
import accountandprivacy from "../../../../../../models/accountandprivacy";
import { NextResponse } from "next/server";

// GET: Fetch settings
export async function GET() {
  try {
    await connectDb();
    const settings = await accountandprivacy.findOne({});
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

