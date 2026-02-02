import { connectDb } from "../../../../../database";
import reviews from "../../../../../../models/reviews";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function DELETE(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);


    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

     if (!admin.permissions.includes("manage_reviews")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

    

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    await reviews.findByIdAndDelete(reviewId);

    await logActivity(admin, "DELETE_REVIEW", `deleted review: ${reviewId}`);

    return NextResponse.json({ success: true, message: "Review deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
