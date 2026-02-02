import { connectDb } from "../../../../../database";
import { NextResponse } from "next/server";
import  ProductSettings from "../../../../../../models/storeProduct";


export async function GET() {
  try {
    await connectDb();
    const settings = await ProductSettings.findOne();
    return NextResponse.json(settings || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
