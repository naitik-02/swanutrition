import { connectDb } from "../../../../../database";
import reviews from "../../../../../../models/reviews";
import { NextResponse } from "next/server";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

// ✅ POST: Add a new review
export async function POST(req) {
  try {
    await connectDb();
    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, userId, rating, comment } = await req.json();

    const review = await reviews.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
