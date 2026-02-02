import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import CheckAuth from "../../../../../../middlewares/isAuth";
import User from "../../../../../../models/user";

export async function PUT(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const currentUser = await CheckAuth(token);

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 }
      );
    }

    await connectDb();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await logActivity(admin, `UPDATE_USER_ROLE`, ` role updated:${userId}`);

    return NextResponse.json(
      { message: "Role updated", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
