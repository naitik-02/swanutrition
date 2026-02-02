import { connectDb } from "../../../../../database";
import Otp from "../../../../../../models/otp";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    const { phone } = await req.json();

    if (!phone)
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({ phone, otp, expiresAt });

    console.log(`Generated OTP for ${phone}: ${otp}`);

    return NextResponse.json(
      { message: "OTP sent successfully" , otp: otp },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      message:error.message
    })
    ;
  }
}
