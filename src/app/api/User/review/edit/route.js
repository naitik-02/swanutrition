import { NextResponse } from "next/server";
import reviews from "../../../../../../models/reviews";
import { connectDb } from "../../../../../database";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { reviewId, rating, comment } = await req.json();

    const updatedReview = await reviews.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
