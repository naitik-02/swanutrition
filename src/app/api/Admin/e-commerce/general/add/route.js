import { connectDb } from "../../../../../../database";
import storeSetting from "../../../../../../../models/storeSetting";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_ecommerce_general")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    let settings = await storeSetting.findOne();

    if (settings) {
      settings = await storeSetting.findByIdAndUpdate(settings._id, body, {
        new: true,
      });
    } else {
      settings = await storeSetting.create(body);
    }

    
 

    await logActivity(admin, "UPDATE_GENERAL-SETTING", `updated general setting`);

    return NextResponse.json({
      success: true,
      message: "Store settings saved successfully",
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save store settings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
