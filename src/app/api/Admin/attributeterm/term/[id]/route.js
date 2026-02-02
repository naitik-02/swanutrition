import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import AttributeTerm from "../../../../../../../models/attributeterm";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_attributes")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { attributeId } = params;

    if (!attributeId) {
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    const terms = await AttributeTerm.find({ attribute: attributeId })
      .populate("attribute")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Terms fetched successfully",
        terms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terms by Attribute GET error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
