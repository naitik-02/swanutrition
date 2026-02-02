import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import AttributeTerm from "../../../../../../models/attributeterm";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "@/utils/logActivity";

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

    const { termIds } = await req.json();

    if (!termIds || !Array.isArray(termIds) || termIds.length === 0) {
      return NextResponse.json(
        { error: "Term IDs array is required" },
        { status: 400 }
      );
    }

    const deleteResult = await AttributeTerm.deleteMany({
      _id: { $in: termIds },
    });
    await logActivity(
      admin,
      "BULK_DELETE_TERM",
      `bulk delete  attribute term: ${termIds}`
    );

    return NextResponse.json(
      {
        message: `${deleteResult.deletedCount} attribute terms deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute Terms Bulk DELETE error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
