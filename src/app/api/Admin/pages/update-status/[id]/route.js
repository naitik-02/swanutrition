import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Page from "../../../../../../../models/page";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PATCH(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

   if (!admin.permissions.includes("update_page")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["draft", "published", "trash"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const page = await Page.findById(id);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    page.status = status;
    await page.save();

    // ✅ Log activity
    await logActivity(admin, "UPDATE_PAGE_STATUS", `changed status of ${page.title} to ${status}`);

    return NextResponse.json(
      {
        message: "Page status updated successfully",
        data: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Page Status PATCH error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
