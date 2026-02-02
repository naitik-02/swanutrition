// /api/admin/faqs/route.js

import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Faq from "../../../../../../../models/faq";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function POST(req) {
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

    const body = await req.json();

    const { question, answer, type } = body;

    if (!question || !answer || !type) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const created = await Faq.create({ question, answer, type });

    await logActivity(admin, "ADD_FAQ", `added faq`);

    return NextResponse.json(
      { message: "FAQ created", data: created },
      { status: 201 }
    );
  } catch (error) {
    console.error("FAQ CREATE ERROR:", error.message);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
