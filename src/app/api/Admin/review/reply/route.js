import { connectDb } from "../../../../../database";
import reviews from "../../../../../../models/reviews";
import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function PATCH(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


      if (!admin.permissions.includes("manage_reviews")) {
              return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }
    

    await connectDb();
    const { reviewId, message, adminId } = await req.json();

    const updatedReview = await reviews.findByIdAndUpdate(
      reviewId,
      {
        reply: {
          message,
          repliedBy: adminId,
          repliedAt: new Date(),
        },
      },
      { new: true }
    );

        await logActivity(admin, "REPLY_REVIEW", `replied review: ${reviewId}`);


    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
