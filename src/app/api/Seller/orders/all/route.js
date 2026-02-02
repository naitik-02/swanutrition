import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const orderStatus = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filter = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus.toLowerCase();
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
      }
    }

    const skip = (page - 1) * limit;

    const total = await Order.countDocuments(filter);

    console.log("Filter being applied:", filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "phone")
      .populate("items.productId")
      .populate("address");

    return NextResponse.json(
      {
        message: "Orders fetched successfully",
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
