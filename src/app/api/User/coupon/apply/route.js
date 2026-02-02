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

    const body = await req.json();
    const code = body?.code?.toUpperCase()?.trim();

    if (!code) {
      return NextResponse.json(
        { message: "Coupon code is required" },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || !cart.items?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json({ message: "Invalid coupon" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { message: "Coupon is inactive" },
        { status: 400 },
      );
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ message: "Coupon expired" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + Number(item.finalPrice) * Number(item.quantity);
    }, 0);

    if (totalAmount < Number(coupon.minCartValue || 0)) {
      return NextResponse.json(
        { message: `Minimum cart value should be ₹${coupon.minCartValue}` },
        { status: 400 },
      );
    }

    if (cart.coupon?.toString() === coupon._id.toString()) {
      return NextResponse.json(
        { message: "Coupon already applied" },
        { status: 400 },
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === "PERCENT") {
      discountAmount = Math.round((totalAmount * coupon.discountValue) / 100);
    } else if (coupon.discountType === "FLAT") {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > totalAmount) discountAmount = totalAmount;

    const finalAmount = totalAmount - discountAmount;

    cart.totalAmount = totalAmount;
    cart.coupon = coupon._id;
    cart.discountAmount = discountAmount;
    cart.finalAmount = finalAmount;

    await cart.save();

 

    return NextResponse.json(
      {
        message: "Coupon applied successfully",
        cart,
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        totalAmount,
        discountAmount,
        finalAmount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Apply coupon error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
