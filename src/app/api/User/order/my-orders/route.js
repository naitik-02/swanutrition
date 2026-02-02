import { connectDb } from "../../../../../database";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";
import { NextResponse } from "next/server";
import Order from "../../../../../../models/order";
import address from "../../../../../../models/address";

export async function GET(req) {
  try {
    await connectDb();
    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ userId: user._id });
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({ userId: user._id })
      .populate("items.productId")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });

  } catch (error) {
    return NextResponse.json({
      message: error.message
    }, { status: 500 });
  }
}