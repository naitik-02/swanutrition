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
    const { status } = body;

    const allowedStatus = ["pending", "in_review", "resolved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }

 

    complaint.status = status;
    await complaint.save();

    return NextResponse.json(
      { message: `Complaint status updated to ${status}`, data: complaint },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Complaint Status Error:", error.message);
    return NextResponse.json(
      { message: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
