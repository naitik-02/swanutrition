import { connectDb } from "../../../../../database";
import Customer from "../../../../../../models/customer";
import Otp from "../../../../../../models/otp";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // 🔍 Check OTP record
    const record = await Otp.findOne({ phone, otp });
    if (!record) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // ⏰ Check expiry properly
    if (record.expiresAt && record.expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ phone });
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    // ✅ Delete all OTPs for this number
    await Otp.deleteMany({ phone });

    // 🧍 Check if user exists
    let user = await Customer.findOne({ phone });
    if (!user) {
      user = await Customer.create({ phone });
    }

    // 🔑 Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    );

    // 🍪 Set cookie
    const response = NextResponse.json(
      {
        message: "OTP verified successfully",
        user: {
          _id: user._id,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again later." },
      { status: 500 }
    );
  }
}
