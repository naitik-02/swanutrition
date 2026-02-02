import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import Cart from "../../../../../../models/cartschema";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function POST(req) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { addressId, paymentMethod } = await req.json();

    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { message: "Address & paymentMethod required" },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const finalAmount =
      cart.finalAmount !== undefined && cart.finalAmount !== null
        ? cart.finalAmount
        : cart.totalAmount;

    const newOrder = await Order.create({
      userId: user._id,
      items: cart.items,
      address: addressId,
      paymentMethod,

      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,

      coupon: cart.coupon || null,
      finalAmount: finalAmount,
    });

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    cart.coupon = null;
    cart.discountAmount = 0;
    cart.finalAmount = 0;

    await cart.save();

 

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("address")
      .populate("items.productId")
      .populate("coupon");

    return NextResponse.json({
      message: "Order placed",
      order: populatedOrder,
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
