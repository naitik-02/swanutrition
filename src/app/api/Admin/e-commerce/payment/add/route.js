import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import storePayment from "../../../../../../../models/storePayment";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

       if (!admin.permissions.includes("manage_payments")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    

    const data = await req.json();

    let settings = await storePayment.findOne();

    if (settings) {
      settings.cod = data.cod;
      settings.check = data.check;
      settings.bankTransfer = data.bankTransfer;
      await settings.save();
    } else {
      settings = await storePayment.create(data);
    }

    await logActivity(
      admin,
      "UPDATED_PAYMENT_SETTING",
      `update payment setting`
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
