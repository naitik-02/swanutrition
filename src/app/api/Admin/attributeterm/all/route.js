import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import AttributeTerm from "../../../../../../models/attributeterm";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const terms = await AttributeTerm.find({})
      .populate("attribute")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Attribute Terms fetched successfully",
        terms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute Terms GET error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
