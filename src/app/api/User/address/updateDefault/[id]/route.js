import { NextResponse } from "next/server";
import Address from "../../../../../../../models/address";
import { connectDb } from "../../../../../../database";
import CustomerIsAuth from "../../../../../../../middlewares/customerIsAuth";
export async function PUT(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("token")?.value;
    const isUser = await CustomerIsAuth(token);

    if (!isUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addressId = params.id;

    
    await Address.updateMany({ user: isUser._id }, { isDefault: false });

    
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: isUser._id },
      { isDefault: true },
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Default address updated", address: updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
