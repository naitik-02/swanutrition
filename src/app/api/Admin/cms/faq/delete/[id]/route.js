import { connectDb } from "../../../../../../../database";
import Faq from "../../../../../../../../models/faq";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

export async function DELETE(_, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("update_cms_faqs")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const { id } = params;

    const deleted = await Faq.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    await logActivity(admin, "DELETE_FAQ", `deleted faq: ${id}`);

    return NextResponse.json({ message: "FAQ deleted" }, { status: 200 });
  } catch (error) {
    console.error("FAQ DELETE ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
