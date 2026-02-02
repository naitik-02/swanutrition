import { connectDb } from "../../../../../database";
import User from "../../../../../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const { email, password, selectedRole } = await req.json();

    if (!email || !password || !selectedRole) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== selectedRole) {
      return NextResponse.json(
        { error: `User does not have ${selectedRole} access` },
        { status: 403 }
      );
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return NextResponse.json(
    //     { error: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // Create token
    const adminToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SEC,
      {
        expiresIn: "7d",
      }
    );

    await logActivity(email, `LOGGED_IN_USER`, `user logged-in: ${email}`);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          ...user.toObject(),
          password: undefined,
        },
      },
      { status: 200 }
    );

    response.cookies.set("adminToken", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
