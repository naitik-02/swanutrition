import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import adminNotificationSchema from "../../../../../../../../models/adminNotificationSchema";
import customerNotificationSchema from "../../../../../../../../models/customerNotificationSchema";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

const adminTypes = [
  "newOrder",
  "canceledOrder",
  "failedOrder",
  "refundedOrder",
];
const customerTypes = [
  "processingOrder",
  "completedOrder",
  "customerOnHoldOrder",
  "customerProcessingOrder",
  "customerCompletedOrder",
  "customerInvoice",
  "customerNote",
  "customerResetPassword",
  "customerNewAccount",
];

export async function PUT(req, { params }) {
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

    const type = params.type;
    const data = await req.json();

    let result;

    if (adminTypes.includes(type)) {
      result = await adminNotificationSchema.findOneAndUpdate(
        { type },
        { $set: data },
        { new: true, upsert: true }
      );
    } else if (customerTypes.includes(type)) {
      result = await customerNotificationSchema.findOneAndUpdate(
        { type },
        { $set: data },
        { new: true, upsert: true }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    await logActivity(admin, "UPDATE_EMAIL", `updated email`);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
