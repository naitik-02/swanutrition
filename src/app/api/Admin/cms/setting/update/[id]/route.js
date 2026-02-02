import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import Setting from "../../../../../../../../models/setting";
import uploadFile from "../../../../../../../../middlewares/upload";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

export async function PUT(req, { params }) {
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
    const settingId = params.id;
    const tagline = formData.get("tagline");
    const title = formData.get("title");
    const search_engine_visibility = formData.get("searchEnginevisibility");
    const open = formData.get("openTime");
    const close = formData.get("closeTime");
    const helpline = formData.get("helpline");
    const email = formData.get("email");
    const storeStatus = formData.get("storeStatus");
    const paymentMethod = formData.get("paymentMethod");
    const whatsapp = formData.get("whatsapp");
    const helpCenterLink = formData.get("helpCenterLink");
    const footerDescription1 = formData.get("footerDescription1");
    const footerDescription2 = formData.get("footerDescription2");
    const footerYear = formData.get("footerYear");
    const socials = JSON.parse(formData.get("socials") || "[]");
    const logo = formData.get("logo");

    let logoUrl = undefined;
    if (logo && typeof logo === "object") {
      const uploaded = await uploadFile(logo);
      logoUrl = uploaded.url;
    }

    const updated = await Setting.findByIdAndUpdate(
      settingId,
      {
        search_engine_visibility,
        title,
        tagline,
        helpline,
        email,
        payment_method: paymentMethod,
        store_status: storeStatus,
        open_time: open,
        close_time: close,
        whatsapp,
        helpCenterLink,
        footerDescription1,
        footerDescription2,
        footerYear,
        socials,
        ...(logoUrl && { logo: logoUrl }),
      },
      { new: true }
    );

    await logActivity(admin, "UPDATE_SETTING", `updated setting`);

    return NextResponse.json({ message: "Setting updated", data: updated });
  } catch (error) {
    console.error("UPDATE SETTING ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
