
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Setting from "../../../../../../../models/setting";


export async function GET() {
  try {
    await connectDb();
    const data = await Setting.findOne();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Setting GET error:", err.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
