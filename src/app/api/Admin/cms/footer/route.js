import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import FooterContent from "../../../../../../models/Footer";
import uploadFile from "../../../../../../middlewares/upload";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const menusRaw = formData.get("menus");
    const menus = menusRaw ? JSON.parse(menusRaw) : [];

    const socialsRaw = formData.get("socials");
    const socials = socialsRaw ? JSON.parse(socialsRaw) : [];

    const infoRaw = formData.get("info");
    const info = infoRaw ? JSON.parse(infoRaw) : [];

    const isActiveRaw = formData.get("isActive");
    const isActive = isActiveRaw ? JSON.parse(isActiveRaw) : true;

    let logo = formData.get("logo") || "";
    const logoFile = formData.get("logoFile");

    if (logoFile && typeof logoFile === "object") {
      if (!logoFile.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Logo must be an image" },
          { status: 400 }
        );
      }

      const uploaded = await uploadFile(logoFile);
      logo = uploaded.url;
    }

    const payload = {
      menus,
      logo,
      socials,
      info,
      isActive,
    };

    const footer = await FooterContent.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    await logActivity(admin, "PUBLISH_FOOTER", "Footer content updated");

    return NextResponse.json(
      { message: "Footer saved successfully", data: footer },
      { status: 200 }
    );
  } catch (error) {
    console.error("FOOTER API ERROR:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error while saving footer" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const footer = await FooterContent.findOne({});

    return NextResponse.json({ data: footer || null }, { status: 200 });
  } catch (error) {
    console.error("GET FOOTER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch footer data" },
      { status: 500 }
    );
  }
}
