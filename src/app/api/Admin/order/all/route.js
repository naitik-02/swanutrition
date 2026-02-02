import { connectDb } from "../../../../../database";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { NextResponse } from "next/server";
import address from "../../../../../../models/address";
import Product from "../../../../../../models/product";
import user from "../../../../../../models/user";
import Order from "../../../../../../models/order";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("view_orders")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const q = searchParams.get("q"); 
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    
    let filter = {};

    
    if (q && mongoose.Types.ObjectId.isValid(q)) {
      filter._id = q;
    }

   
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

   
    if (year) {
      const y = parseInt(year);
      const m = month ? parseInt(month) - 1 : 0;

      const from = new Date(y, m, 1);
      const to = month
        ? new Date(y, m + 1, 0, 23, 59, 59)
        : new Date(y, 11, 31, 23, 59, 59);

      filter.createdAt = { $gte: from, $lte: to };
    }

    
    const orders = await Order.find(filter)
      .populate("userId", "name email")
      .populate("items.productId")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
