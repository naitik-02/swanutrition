import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import storeVisibility from "../../../../../../../models/storeVisibility";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_visibility")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const data = await req.json();

    let settings = await storeVisibility.findOne();

    if (settings) {
      settings.mode = data.mode;
      await settings.save();
    } else {
      settings = await storeVisibility.create(data);
    }

    await logActivity(
      admin,
      "UPDATED_VISIBILITY_SETTING",
      `updated visibility setting`
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
