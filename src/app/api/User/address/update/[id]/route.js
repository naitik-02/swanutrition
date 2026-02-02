import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDb } from "../../../../../../database";
import Address from "../../../../../../../models/address";
import CustomerIsAuth from "../../../../../../../middlewares/customerIsAuth";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Get token from cookies
    const token = cookies().get("token")?.value;
    const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    if (body.isDefault) {
      await Address.updateMany(
        { user: user._id, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, user: user._id },
      body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
