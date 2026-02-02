import { NextResponse } from "next/server";
import { connectDb } from "@/database";
import Activity from "../../../../../models/activityLog";
import CheckAuth from "../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();
  const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

   
    if (!admin.permissions.includes("view_activities")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const startDate = searchParams.get("startDate"); 
    const endDate = searchParams.get("endDate");     

    const query = {};

    // ✅ Date filter if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59"),
      };
    }

    const total = await Activity.countDocuments(query);

    const activities = await Activity.find(query)
      .populate("user", "name role email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        activities,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
