import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import CheckAuth from "../../../../../../middlewares/isAuth";
import User from "../../../../../../models/user";
import bcrypt from "bcryptjs";
import { logActivity } from "../../../../../utils/logActivity.js";

export async function PUT(req) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const currentUser = await CheckAuth(token);

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!currentUser.permissions.includes("update_users")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, data } = body;

    await connectDb();

    let targetUserId = userId || currentUser._id;

    if (
      currentUser.role !== "admin" &&
      targetUserId.toString() !== currentUser._id.toString()
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (currentUser.role !== "admin") {
      delete data.email;
      delete data.phone;
      delete data.role;
      delete data.permissions;
    }

    if (data.password && data.password.trim() !== "") {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, data, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await logActivity(currentUser, `UPDATE_USER`, ` update user: ${userId}`);

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
