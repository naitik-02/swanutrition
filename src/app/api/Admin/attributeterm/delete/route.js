import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import AttributeTerm from "../../../../../../models/attributeterm";
import { logActivity } from "../../../../../utils/logActivity";

export async function DELETE(req) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_attributes")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Attribute Term ID is required" },
        { status: 400 }
      );
    }

    const deleted = await AttributeTerm.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Attribute Term not found" },
        { status: 404 }
      );
    }

    await logActivity(admin, "DELETE_TERM", ` delete  attribute term: ${id}`);

    return NextResponse.json(
      {
        message: "Attribute Term deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute Term DELETE error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
