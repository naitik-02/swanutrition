import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Cart from "../../../../../../models/cartschema";
import Coupon from "../../../../../../models/Coupon"; 
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function DELETE(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, unit } = await req.json();

    if (!productId || !unit) {
      return NextResponse.json(
        { message: "productId and unit are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const index = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() && item.unit === unit
    );

    if (index === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // ✅ remove item
    cart.items.splice(index, 1);

    // ✅ recalc totals safely
    cart.totalItems = cart.items.reduce((sum, i) => sum + Number(i.quantity), 0);

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + Number(i.finalPrice) * Number(i.quantity),
      0
    );

    // ✅ coupon recalculation
    if (cart.items.length === 0) {
      // cart empty => remove coupon too
      cart.coupon = null;
      cart.discountAmount = 0;
      cart.finalAmount = 0;
    } else if (cart.coupon) {
      const coupon = await Coupon.findById(cart.coupon);

      const isValid =
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date() &&
        cart.totalAmount >= Number(coupon.minCartValue || 0);

      if (!isValid) {
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



    return NextResponse.json({ message: "Item removed from cart", cart });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
