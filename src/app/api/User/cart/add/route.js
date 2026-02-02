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

    const { productId, unit, image, title } = await req.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const unitDetails = product.units.find((u) => u.unit === unit);
    if (!unitDetails) {
      return NextResponse.json(
        { message: "Unit not available" },
        { status: 400 },
      );
    }

    const price = unitDetails.price;
    const finalPrice = unitDetails.finalPrice;

    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: user._id,
        items: [
          { productId, unit, price, finalPrice, quantity: 1, title, image },
        ],
        totalItems: 1,
        totalAmount: finalPrice,

        // ✅ coupon fields default
        coupon: null,
        discountAmount: 0,
        finalAmount: finalPrice,
      });
    } else {
      // ✅ update existing cart
      const index = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId.toString() &&
          item.unit === unit,
      );

      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({
          productId,
          unit,
          price,
          finalPrice,
          quantity: 1,
          image,
          title,
        });
      }

      cart.totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + Number(item.finalPrice) * Number(item.quantity),
        0,
      );

      if (cart.coupon) {
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
              (cart.totalAmount * coupon.discountValue) / 100,
            );
          } else if (coupon.discountType === "FLAT") {
            discountAmount = coupon.discountValue;
          }

          if (discountAmount > cart.totalAmount)
            discountAmount = cart.totalAmount;

          cart.discountAmount = discountAmount;
          cart.finalAmount = cart.totalAmount - discountAmount;
        }
      } else {
        cart.discountAmount = 0;
        cart.finalAmount = cart.totalAmount;
      }

      await cart.save();
    }

   

    return NextResponse.json({ message: "Item added to cart", cart });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
