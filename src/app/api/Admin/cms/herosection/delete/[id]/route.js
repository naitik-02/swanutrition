import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import HeroSection from "../../../../../../../../models/herosection";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const { id } = await params; // ✅ await params
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("update_cms_hero")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const deleted = await HeroSection.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    await logActivity(admin, "DELETE_HERO_SECTION", `Deleted hero section`);

    return NextResponse.json({ message: "Slide deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE SLIDER ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
