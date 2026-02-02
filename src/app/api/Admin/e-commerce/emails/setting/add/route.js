// /app/api/email-settings/route.js

import { connectDb } from "../../../../../../../database";
import emailSettingSchema from "../../../../../../../../models/emailSettingSchema";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

// PUT: Update general email settings
export async function PUT(req) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_email_settings")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    const updated = await emailSettingSchema.findOneAndUpdate(
      {},
      {
        fromName: body.fromName,
        fromAddress: body.fromAddress,
        emailFooterText: body.emailFooterText,
      },
      { upsert: true, new: true }
    );

    await logActivity(admin, "SETTING_UPDATED", `setting updated`);

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
