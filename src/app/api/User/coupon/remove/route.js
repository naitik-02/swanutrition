import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Cart from "../../../../../../models/cartschema";
import Coupon from "../../../../../../models/Coupon";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + Number(item.finalPrice) * Number(item.quantity);
    }, 0);

    cart.coupon = null;
    cart.discountAmount = 0;
    cart.totalAmount = totalAmount;
    cart.finalAmount = totalAmount;

    await cart.save();

   

    return NextResponse.json(
      {
        message: "Coupon removed successfully",
        cart,
        totalAmount,
        discountAmount: 0,
        finalAmount: totalAmount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remove coupon error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
