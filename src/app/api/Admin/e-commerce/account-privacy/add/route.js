import { connectDb } from "../../../../../../database";
import accountandprivacy from "../../../../../../../models/accountandprivacy";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PATCH(req) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_account_privacy")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    const updatedSettings = await accountandprivacy.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    await logActivity(
      admin,
      "UPDATE_ACCOUNT_PRIVACY",
      `updated account privacy `
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
