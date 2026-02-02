import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Page from "../../../../../../../models/page";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function DELETE(req) {
  try {
    await connectDb();

    // ✅ Auth check
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


     if (!admin.permissions.includes("update_page")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

    // ✅ Get IDs from request body
    const { pageId, sectionId } = await req.json();

    if (!pageId || !sectionId) {
      return NextResponse.json(
        { message: "pageId and sectionId are required" },
        { status: 400 }
      );
    }

    // ✅ Find page
    const page = await Page.findById(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    // ✅ Find section inside page
    const section = page.sections.id(sectionId);
    if (!section) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    // ✅ Remove section
    section.deleteOne(); // or section.remove() in older mongoose versions

    // ✅ Save page
    await page.save();

    return NextResponse.json(
      { message: "Section deleted successfully", data: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete section error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
