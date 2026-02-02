// /app/api/email-settings/route.js

import { connectDb } from "../../../../../../database";
import emailSettingSchema from "../../../../../../../models/emailSettingSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();

    const settings = await emailSettingSchema.findOne({});
    return NextResponse.json(settings || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
