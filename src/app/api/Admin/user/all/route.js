import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import User from "../../../../../../models/user";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const authUser = await CheckAuth(token);

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!authUser.permissions.includes("view_users")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await connectDb();

    const { searchParams } = req.nextUrl;

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || null;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Users GET error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
