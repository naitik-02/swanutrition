import { connectDb } from "../../../../../../database";
import Address from "../../../../../../../models/address";
import { NextResponse } from "next/server";
import CustomerIsAuth from "../../../../../../../middlewares/customerIsAuth";

export async function DELETE(req, { params }) {

  try {
    const { id } = params;
   const token = req.cookies.get("token")?.value;

    const isUser = await CustomerIsAuth(token);
    if (!isUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const address = await Address.findById(id);
    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: 404 }
      );
    }

    if (address.user.toString() !== isUser._id.toString()) {
      return NextResponse.json(
        { message: "Forbidden: You can't delete this address" },
        { status: 403 }
      );
    }

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (deletedAddress.isDefault) {
      const anotherAddress = await Address.findOne({ user: isUser._id });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    return NextResponse.json({ message: "Address deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
