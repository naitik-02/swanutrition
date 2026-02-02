import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";
import User from "../../../../../../models/user";
import { connectDb } from "../../../../../database";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.json({
        user: null,
        message: "Not logged in",
      });
    }

    const user = await CheckAuth(token);

    if (!user) {
      return NextResponse.json({
        user: null,
        message: "Invalid token",
      });
    }

    const dbUser = await User.findById(user._id).select("-password");

    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error) {
    console.error("Fetch Admin User Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
