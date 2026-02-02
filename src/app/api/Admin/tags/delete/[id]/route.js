import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Tag from "../../../../../../../models/tag";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function DELETE(req, { params }) {
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

    const deleted = await Tag.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Tag not found" }, { status: 404 });
    }

    await logActivity(admin, "DELETE_TAG", `Deleted tag: ${deleted.name}`);

    return NextResponse.json(
      { message: "Tag Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
   
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
