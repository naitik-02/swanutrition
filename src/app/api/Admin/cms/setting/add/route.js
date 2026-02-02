import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Setting from "../../../../../../../models/setting";
import uploadFile from "../../../../../../../middlewares/upload";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_general_settings")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await req.formData();

    const title = formData.get("title");

    const open = formData.get("openTime");
    const close = formData.get("closeTime");

    const storeStatus = formData.get("storeStatus");

    const logo = formData.get("logo");

    const freeDeliveryThreshold = formData.get("free_delivery_threshold");
    const platformFee = formData.get("platform_fee");
    const defaultDeliveryCharge = formData.get("default_delivery_charge");
    const distanceSlabs = JSON.parse(formData.get("distance_slabs") || "[]");
    console.log("formdata",formData)

    let logoUrl = "";
    if (logo && typeof logo === "object") {
      const uploaded = await uploadFile(logo);
      logoUrl = uploaded.url;
    }

    const created = await Setting.create({
      title,

      store_status: storeStatus,
      open_time: open,
      close_time: close,

      logo: logoUrl,
      free_delivery_threshold: freeDeliveryThreshold,
      platform_fee: platformFee,
      default_delivery_charge: defaultDeliveryCharge,
      distance_slabs: distanceSlabs,
    });

    await logActivity(
      admin,
      "ADD_SETTING",
      `added setting with delivery rules`,
    );

    return NextResponse.json(
      { message: "Setting created", data: created },
      { status: 201 },
    );
  } catch (error) {
    console.error("ADD SETTING ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
