// /api/admin/faqs/route.js
import { NextResponse } from "next/server";
import Faq from "../../../../../../../models/faq";
import { connectDb } from "../../../../../../database";

export async function GET() {
  try {
    await connectDb();

    

    const faqs = await Faq.find({status: "active"});

    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("FAQ FETCH ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
