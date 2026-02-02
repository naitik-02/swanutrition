import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Order from "../../../../../../../models/order";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function PATCH(req, { params }) {
  try {
    await connectDb();

  
     const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params; 
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "delivered", "cancelled"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { message: "Invalid status. Allowed: pending, delivered, cancelled" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({_id: id});

    if (!order) {
      return NextResponse.json(
        { message: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    order.orderStatus = status.toLowerCase();
    await order.save();

    return NextResponse.json(
      { message: "Order status updated successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order PATCH error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
