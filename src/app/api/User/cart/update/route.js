import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Cart from "../../../../../../models/cartschema";
import Coupon from "../../../../../../models/Coupon"; 
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, unit, action } = await req.json();

   
    const validActions = ["increase", "decrease", "increment", "decrement"];
    if (!productId || !unit || !validActions.includes(action)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString() && item.unit === unit
    );

    if (index === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    const item = cart.items[index];

    // ✅ Update item qty
    if (action === "increase" || action === "increment") {
      item.quantity += 1;
    } else if (action === "decrease" || action === "decrement") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items.splice(index, 1);
      }
    }

    // ✅ Recalculate totals (safe way)
    cart.totalItems = cart.items.reduce((sum, i) => sum + Number(i.quantity), 0);

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + Number(i.finalPrice) * Number(i.quantity),
      0
    );

    // ✅ Coupon recalculation
    if (cart.coupon) {
      const coupon = await Coupon.findById(cart.coupon);

      const isValid =
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date() &&
        cart.totalAmount >= Number(coupon.minCartValue || 0);

      if (!isValid) {
        // auto remove coupon
        cart.coupon = null;
        cart.discountAmount = 0;
        cart.finalAmount = cart.totalAmount;
      } else {
        let discountAmount = 0;

        if (coupon.discountType === "PERCENT") {
          discountAmount = Math.round(
            (cart.totalAmount * coupon.discountValue) / 100
          );
        } else if (coupon.discountType === "FLAT") {
          discountAmount = coupon.discountValue;
        }

        if (discountAmount > cart.totalAmount) discountAmount = cart.totalAmount;

        cart.discountAmount = discountAmount;
        cart.finalAmount = cart.totalAmount - discountAmount;
      }
    } else {
      cart.discountAmount = 0;
      cart.finalAmount = cart.totalAmount;
    }

    await cart.save();

  

    return NextResponse.json({ message: `Item ${action}d`, cart });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
