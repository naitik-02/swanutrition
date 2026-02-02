import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import PaymentSettings from "../../../../../../models/storePayment";


export async function GET() {
  try {
    await connectDb();
    const settings = await PaymentSettings.findOne();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
