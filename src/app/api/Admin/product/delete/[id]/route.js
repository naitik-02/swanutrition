import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Product from "../../../../../../../models/product";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function DELETE(req, context) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("delete_products")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await  context.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await logActivity(admin, "DELETE_PRODUCT", `product deleted: ${id}`);

    return NextResponse.json(
      { message: "Product deleted successfully", product: deletedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
