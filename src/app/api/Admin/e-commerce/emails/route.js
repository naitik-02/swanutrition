// /app/api/notifications/all/route.js

import { connectDb } from "../../../../../database";
import adminNotificationSchema from "../../../../../../models/adminNotificationSchema";
import customerNotificationSchema from "../../../../../../models/customerNotificationSchema";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminNotifications = await adminNotificationSchema.find({});
    const customerNotifications = await customerNotificationSchema.find({});

    return NextResponse.json({
      adminNotifications,
      customerNotifications,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
