import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Complaint from "../../../../../../models/complaint";
import Product from "../../../../../../models/product";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

      const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
const complaints = await Complaint.find()
      .populate("userId", "name email")
      .populate("orderId", "_id totalAmount status")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Complaints fetched successfully",
        count: complaints.length,
        data: complaints,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complaint GET (seller) error:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}
