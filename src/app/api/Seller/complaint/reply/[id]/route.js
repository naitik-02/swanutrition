import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Complaint from "../../../../../../../models/complaint";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function PUT(req, { params }) {
  try {
    await connectDb();

      const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { sellerReply } = body;

    if (!sellerReply) {
      return NextResponse.json(
        { message: "Reply message is required" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }


    complaint.sellerReply = sellerReply;
    await complaint.save();

    return NextResponse.json(
      { message: "Reply added successfully", data: complaint },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seller Reply Error:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to add reply" },
      { status: 500 }
    );
  }
}
