import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";
import User from "../../../../../../models/user";
import { connectDb } from "../../../../../database";

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const user = await CheckAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await connectDb();

    const singleUser = await User.findById(id);
    if (!singleUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: singleUser }, { status: 200 });
  } catch (error) {
    console.error("Fetch Single User Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
