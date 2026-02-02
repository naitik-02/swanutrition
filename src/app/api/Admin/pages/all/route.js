import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Page from "../../../../../../models/page";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    // ✅ Check admin authentication
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("view_pages")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // ✅ Fetch all pages
    const pages = await Page.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Pages fetched successfully",
        data: pages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Page GET error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
