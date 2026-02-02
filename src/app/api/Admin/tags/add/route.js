import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Tag from "../../../../../../models/tag";
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

    if (!admin.permissions.includes("manage_product_tags")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 }
      );
    }

    const isExisting = await Tag.findOne({ slug });
    if (isExisting) {
      return NextResponse.json(
        { message: "Tag Already Exists" },
        { status: 409 }
      );
    }

    const created = await Tag.create({ name, slug, description });

    await logActivity(admin, "ADD_TAG", `Added new tag: ${name}`);

    return NextResponse.json(
      { message: "Tag Added Successfully", data: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("Tag POST error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
