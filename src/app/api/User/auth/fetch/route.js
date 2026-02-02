import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";
import Customer from "../../../../../../models/customer";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        user: null,
        message: "Not logged in",
      });
    }

    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({
        user: null,
        message: "Invalid token",
      });
    }

  

    const dbUser = await Customer.findById(user._id).select("phone");


    return NextResponse.json({
      user: dbUser,
      message: "User fetched from DB",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
