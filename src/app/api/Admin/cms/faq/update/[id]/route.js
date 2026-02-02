// /api/admin/faqs/[id]/route.js

import { NextResponse } from "next/server";
import Faq from "../../../../../../../../models/faq";
import { connectDb } from "../../../../../../../database";
import CheckAuth from "../../../../../../../../middlewares/isAuth";

export async function PUT(req, { params }) {
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
    const body = await req.json();

    const updated = await Faq.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    await logActivity(admin, "UPDATE_FAQ", `updated faq: ${id}`);

    return NextResponse.json(
      { message: "FAQ updated", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ UPDATE ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
