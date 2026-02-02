import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Attribute from "../../../../../../models/attribute";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const attributes = await Attribute.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Attributes fetched successfully",
        attributes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attributes GET error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
