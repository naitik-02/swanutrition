import { NextResponse } from "next/server";
import Address from "../../../../../../models/address";
import { connectDb } from "../../../../../database";
import CustomerIsAuth from "../../../../../../middlewares/customerIsAuth";
export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const isUser = await CustomerIsAuth(token);

    if (!isUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const body = await req.json();

    const {
      name,
      phone,

      addressLine,
      landmark,
      location,
      type,
      isDefault,
    } = body;

    if (!name || !phone || !addressLine) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 },
      );
    }

    if (isDefault) {
      await Address.updateMany({ user: isUser._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: isUser._id,
      name,
      phone,

      addressLine,
      landmark,
      location,
      type,
      isDefault,
    });

    return NextResponse.json(
      { message: "Address created", address },
      { status: 201 },
    );
 } catch (error) {
  console.error("ADDRESS POST ERROR:", error);

  return NextResponse.json(
    {
      message: "Server Error",
      error: error?.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error.stack : null,
    },
    { status: 500 }
  );
}
}
