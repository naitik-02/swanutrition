import { connectDb } from "../../../../../../database";
import { NextResponse } from "next/server";
import ProductSettings from "../../../../../../../models/storeProduct";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

        if (!admin.permissions.includes("manage_ecommerce_products")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    let settings = await ProductSettings.findOne();
    if (settings) {
      // Update existing
      await ProductSettings.updateOne({}, { $set: body });
    } else {
      // Create new
      await ProductSettings.create(body);
    }

    await logActivity(
      admin,
      "UPDATED_PRODUCT_SETTING",
      `updated product setting`
    );

    return NextResponse.json(
      { message: "Product settings saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
