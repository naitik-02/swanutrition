import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Complaint from "../../../../../../models/complaint";
import Product from "../../../../../../models/product";

import customer from "../../../../../../models/customer";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Complaint ID required" }, { status: 400 });
    }

    const complaint = await Complaint.findById(id)
      .populate("userId", "name email")
      .populate("orderId", "_id totalAmount status")

    

    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }

 
    return NextResponse.json(
      {
        message: "Complaint fetched successfully",
        data: complaint,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complaint GET by ID error:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}
