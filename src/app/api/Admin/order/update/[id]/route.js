import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Order from "../../../../../../../models/order";
import Product from "../../../../../../../models/product";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    const newStatus = status.toLowerCase();

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // ✅ Increase totalSold ONLY once (first delivery)
    if (newStatus === "delivered" && order.orderStatus !== "delivered") {
      await Promise.all(
        order.items.map((item) =>
          Product.findByIdAndUpdate(
            item.productId,
            { $inc: { totalSold: item.quantity } }
          )
        )
      );
    }

    order.orderStatus = newStatus;
    await order.save();

    return NextResponse.json(
      { message: "Order status updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
