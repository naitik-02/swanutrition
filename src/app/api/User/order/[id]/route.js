import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import address from "../../../../../../models/address";

import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function GET(req, { params }) {
 try {
     await connectDb();
 const token = req.cookies.get("token")?.value;
  const user = await CustomerIsAuth(token);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


    const { id } = await params;

    const order = await Order.findOne({ _id: id, userId: user._id })
    .populate("items.productId")
    .populate("address");

  if (!order)
    return NextResponse.json({ message: "Order not found" }, { status: 404 });

  return NextResponse.json({ order });

  
 } catch (error) {
    return NextResponse.json({
        message:error.message
    })
 }
}
