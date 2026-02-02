import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Cart from "../../../../../../models/cartschema";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";
import Product from "../../../../../../models/product";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({
        message: "Guest cart",
        cart: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }



    const cart = await Cart.findOne({ userId: user._id })
      .populate("items.productId")
      .lean();

    if (!cart) {
      return NextResponse.json({
        message: "Cart is empty",
        cart: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      });
    }


    return NextResponse.json({
      message: "Cart fetched from DB",
      cart,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
