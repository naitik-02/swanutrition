import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import HeroSection from "../../../../../../../models/herosection";
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

    if (!admin.permissions.includes("update_cms_hero")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await req.formData();

    const category = formData.get("category");
    const url = formData.get("url");
    const title = formData.get("title");
    const description = formData.get("description");
    const discount = formData.get("discount");
    const order = parseInt(formData.get("order")) || 0;
    const status = formData.get("status") || "active";
    const image = formData.get("backgroundImage");

    if (!url || !image) {
      return NextResponse.json(
        { message: "category, title, description, and image are required" },
        { status: 400 }
      );
    }

    let bgUrl = "";
    if (image && typeof image === "object") {
      const uploaded = await uploadFile(image);
      bgUrl = uploaded.url;
    }

    const created = await HeroSection.create({
      category,
      title,
      description,
      backgroundImage: bgUrl,
      discount,
      order,
      url,
      status,
    });

    await logActivity(admin, "CREATE_HERO_SECTION", `create hero section`);

    return NextResponse.json(
      { message: "Hero category slide created", data: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("HERO SLIDER CREATE ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
