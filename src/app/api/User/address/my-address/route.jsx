import { connectDb } from "../../../../../database";
import { NextResponse } from "next/server";
import Address from "../../../../../../models/address";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    const isUser = await CustomerIsAuth(token);
    if (!isUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const addresses = await Address.find({ user: isUser._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json(
      { message: "Addresses fetched", addresses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
