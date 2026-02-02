import { connectDb } from "../../../../../database";
import PostTag from "../../../../../../models/postTags";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const tags = await PostTag.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
