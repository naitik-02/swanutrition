import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Complaint from "../../../../../../../models/complaint";
import CustomerIsAuth from "../../../../../../../middlewares/customerIsAuth";
import customer from "../../../../../../../models/customer";
import order from "../../../../../../../models/order";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    console.log("Order ID received:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Order ID required" },
        { status: 400 },
      );
    }

    const complaint = await Complaint.findOne({ orderId: id })
      .populate("userId", "name email phone")
      .populate("orderId", "_id totalAmount orderStatus");

    console.log("Complaint found:", complaint);

    if (!complaint) {
      return NextResponse.json(
        {
          message: "No complaint found for this order",
          data: null,
        },
        { status: 200 },
      );
    }

    if (!complaint.userId || !complaint.userId._id) {
      console.error("Complaint userId is null or not populated");
      return NextResponse.json(
        {
          message: "Complaint data is incomplete",
          data: null,
        },
        { status: 500 },
      );
    }

    if (complaint.userId._id.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(
      {
        message: "Complaint fetched successfully",
        data: complaint,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Complaint GET by Order error:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to fetch complaint" },
      { status: 500 },
    );
  }
}
