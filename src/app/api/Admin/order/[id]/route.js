import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!admin.permissions.includes("view_orders")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const order = await Order.findById(params.id)
      .populate("userId", "phone")
      .populate("items.productId")
      .populate("address");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order fetched", order });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
