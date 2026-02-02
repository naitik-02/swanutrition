import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Page from "../../../../../../../models/page";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

// ✅ DELETE Page
export async function DELETE(req, { params }) {
  try {
    await connectDb();

 
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_pages")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = params;

    // ✅ Find page
    const page = await Page.findById(id);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    // ✅ Delete page
    await Page.findByIdAndDelete(id);

    // ✅ Log activity
    await logActivity(admin, "DELETE_PAGE", `deleted page : ${page.title}`);

    return NextResponse.json(
      { message: "Page Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Page DELETE error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
