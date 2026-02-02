import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Product from "../../../../../../../models/product";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PATCH(req , context) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("update_products")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const { status } = await req.json(); 
    if (!["active", "deactive"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await logActivity(
      admin,
      "UPDATE_PRODUCT_STATUS",
      `product ${id} status changed to ${status}`
    );

    return NextResponse.json(
      {
        message: `Product status updated to ${status}`,
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product status update error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
