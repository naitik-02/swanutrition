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

    const tagline = formData.get("tagline");
    const title = formData.get("title");
    const search_engine_visibility = formData.get("searchEnginevisibility");
    const helpline = formData.get("helpline");
    const email = formData.get("email");
    const open = formData.get("openTime");
    const close = formData.get("closeTime");
    const whatsapp = formData.get("whatsapp");
    const storeStatus = formData.get("storeStatus");
    const paymentMethod = formData.get("paymentMethod");
    const helpCenterLink = formData.get("helpCenterLink");
    const footerDescription = formData.get("footerDescription");
    const footerYear = formData.get("footerYear");
    const socials = JSON.parse(formData.get("socials") || "[]");
    const logo = formData.get("logo");

    if (!helpline || !email) {
      return NextResponse.json(
        { message: "helpline and email required" },
        { status: 400 }
      );
    }

    let logoUrl = "";
    if (logo && typeof logo === "object") {
      const uploaded = await uploadFile(logo);
      logoUrl = uploaded.url;
    }

    const created = await Setting.create({
      search_engine_visibility,
      title,
      tagline,
      helpline,
      email,
      whatsapp,
      payment_method: paymentMethod,
      store_status: storeStatus,
      open_time: open,
      close_time: close,
      helpCenterLink,
      footerDescription,
      footerYear,
      socials,
      logo: logoUrl,
    });

    await logActivity(admin, "ADD_SETTING", `added setting`);

    return NextResponse.json(
      { message: "Setting created", data: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD SETTING ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
