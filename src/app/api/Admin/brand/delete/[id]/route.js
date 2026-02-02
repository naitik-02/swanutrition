import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Brand from "../../../../../../../models/brand";
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

     if (!admin.permissions.includes("manage_brands")) {
              return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }

    const id = params.id;

    const deleted = await Brand.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    await logActivity(admin, "DELETE_BRAND", `delete brand : ${id}`);

    return NextResponse.json(
      { message: "Brand Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Brand DELETE error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
