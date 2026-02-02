// /api/admin/hero-category-slider/[id]/route.js

import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import HeroSection from "../../../../../../../../models/herosection";
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

    if (!admin.permissions.includes("update_cms_hero")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = params;
    const formData = await req.formData();

    const category = formData.get("category");
    const url = formData.get("url");
    const title = formData.get("title");
    const description = formData.get("description");
    const discount = formData.get("discount");
    const order = parseInt(formData.get("order")) || 0;
    const status = formData.get("status") || "active";
    const image = formData.get("backgroundImage");

    const updateData = {
      category,
      title,
      description,
      discount,
      order,
      status,
      url,
    };

    if (image && typeof image === "object") {
      const uploaded = await uploadFile(image);
      updateData.backgroundImage = uploaded.url;
    }

    const updated = await HeroSection.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    await logActivity(admin, "UPDATE_HERO_SECTION", `updated hero section`);

    return NextResponse.json(
      { message: "Updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE SLIDER ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
