// app/api/User/cart/merge/route.js
import { NextResponse } from "next/server";
import Cart from "../../../../../../models/cartschema";
import Product from "../../../../../../models/product";
import Coupon from "../../../../../../models/Coupon";
import { connectDb } from "../../../../../database";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cart: guestCartItems } = await req.json();

    if (!guestCartItems || !Array.isArray(guestCartItems)) {
      return NextResponse.json({ message: "Invalid cart data" }, { status: 400 });
    }

    let dbCart = await Cart.findOne({ userId: user._id });

    if (!dbCart) {
      const processedItems = [];

      for (const guestItem of guestCartItems) {
        let image = guestItem.image;

        if (!image) {
          const product = await Product.findById(guestItem.productId).select(
            "image images"
          );
          image = product?.image || product?.images?.[0] || null;
        }

        processedItems.push({
          productId: guestItem.productId,
          unit: guestItem.unit,
          price: guestItem.price,
          finalPrice: guestItem.finalPrice,
          quantity: guestItem.quantity,
          image,
          title: guestItem.title,
        });
      }

      const totalItems = processedItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );

      const totalAmount = processedItems.reduce(
        (sum, item) => sum + Number(item.finalPrice) * Number(item.quantity),
        0
      );

      dbCart = await Cart.create({
        userId: user._id,
        items: processedItems,
        totalItems,
        totalAmount,

        coupon: null,
        discountAmount: 0,
        finalAmount: totalAmount,
      });
    } else {
      const mergedItems = [...dbCart.items];

      for (const guestItem of guestCartItems) {
        const existingIndex = mergedItems.findIndex(
          (dbItem) =>
            dbItem.productId.toString() === guestItem.productId &&
            dbItem.unit === guestItem.unit
        );

        if (existingIndex > -1) {
          mergedItems[existingIndex].quantity += Number(guestItem.quantity);
        } else {
          let image = guestItem.image;

          if (!image) {
            const product = await Product.findById(guestItem.productId).select(
              "image images"
            );
            image = product?.image || product?.images?.[0] || null;
          }

          mergedItems.push({
            productId: guestItem.productId,
            unit: guestItem.unit,
            price: guestItem.price,
            finalPrice: guestItem.finalPrice,
            quantity: guestItem.quantity,
            image,
            title: guestItem.title,
          });
        }
      }

      // ✅ Recalculate totals
      const totalItems = mergedItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );

      const totalAmount = mergedItems.reduce(
        (sum, item) => sum + Number(item.finalPrice) * Number(item.quantity),
        0
      );

      // ✅ Update db cart
      dbCart.items = mergedItems;
      dbCart.totalItems = totalItems;
      dbCart.totalAmount = totalAmount;
    }

    // ✅ Coupon Recalculation (after merge)
    if (!dbCart.items || dbCart.items.length === 0) {
      dbCart.coupon = null;
      dbCart.discountAmount = 0;
      dbCart.finalAmount = 0;
    } else if (dbCart.coupon) {
      const coupon = await Coupon.findById(dbCart.coupon);

      const isValid =
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date() &&
        dbCart.totalAmount >= Number(coupon.minCartValue || 0);

      if (!isValid) {
        dbCart.coupon = null;
        dbCart.discountAmount = 0;
        dbCart.finalAmount = dbCart.totalAmount;
      } else {
        let discountAmount = 0;

        if (coupon.discountType === "PERCENT") {
          discountAmount = Math.round(
            (dbCart.totalAmount * coupon.discountValue) / 100
          );
        } else if (coupon.discountType === "FLAT") {
          discountAmount = coupon.discountValue;
        }

        if (discountAmount > dbCart.totalAmount) discountAmount = dbCart.totalAmount;

        dbCart.discountAmount = discountAmount;
        dbCart.finalAmount = dbCart.totalAmount - discountAmount;
      }
    } else {
      dbCart.discountAmount = 0;
      dbCart.finalAmount = dbCart.totalAmount;
    }

    await dbCart.save();

    return NextResponse.json({
      message: "Cart merged successfully",
      cart: dbCart,
    });
  } catch (error) {
    console.error("Cart merge error:", error);
    return NextResponse.json(
      {
        message: "Failed to merge cart",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
