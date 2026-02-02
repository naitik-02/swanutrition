import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import Cart from "../../../../../../models/cartschema";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";
import Product from "../../../../../../models/product";

export async function POST(req) {
  try {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID required" },
        { status: 400 },
      );
    }

    const oldOrder = await Order.findOne({
      _id: orderId,
      userId: user._id,
    }).populate("items.productId");

    if (!oldOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }

    for (const oldItem of oldOrder.items) {
      const product = oldItem.productId;
      if (!product) continue;

      const unitDetails = product.units.find((u) => u.unit === oldItem.unit);
      if (!unitDetails) continue;

      const price = unitDetails.price;
      const finalPrice = unitDetails.finalPrice;

      const index = cart.items.findIndex(
        (i) =>
          i.productId.toString() === product._id.toString() &&
          i.unit === oldItem.unit,
      );

      if (index > -1) {
        cart.items[index].quantity += oldItem.quantity;
      } else {
        cart.items.push({
          productId: product._id,
          unit: oldItem.unit,
          price,
          finalPrice,
          quantity: oldItem.quantity,
          title: product.title,
          image: product.images?.[0] || null, // ensure image always exists
        });
      }
    }

    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.finalPrice * i.quantity,
      0,
    );

    await cart.save();

    try {
      const cacheKey = `cart:${user._id}`;
    
    } catch (err) {
      console.warn("Redis cache failed:", err.message);
    }

    return NextResponse.json({ message: "Reorder added to cart", cart });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
