
import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Tag from "../../../../../../../models/tag";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";


export async function PUT(req, { params }) {
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

    const { id } = params;
    const body = await req.json();
    const { name, slug, description } = body;

    const updated = await Tag.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    await logActivity(admin, "UPDATE_TAG", `Updated tag: ${name}`);

    return NextResponse.json(
      { message: "Tag Updated Successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tag PUT error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
