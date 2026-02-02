import { AsyncParser } from "@json2csv/node";
import mongoose from "mongoose";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
     if (!admin.permissions.includes("export_orders")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        
    const body = await req.json();
    let selectedFields = body.fields || [
      "userId",
      "totalAmount",
      "orderStatus",
    ];

    const fieldMap = {
      userId: "userId.name", // or whatever field you want from User
      address: "address.street",
      items: "items",
      paymentMethod: "paymentMethod",
      paymentStatus: "paymentStatus",
      orderStatus: "orderStatus",
      totalItems: "totalItems",
      totalAmount: "totalAmount",
      deliveredAt: "deliveredAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const fields = selectedFields.map((f) => fieldMap[f] || f);

    const orders = await Order.find({})
      .populate("userId", "name email phone") // Adjust fields as needed
      .populate("address", "street city state pincode") // Adjust fields as needed
      .populate("items.productId", "title") // Populate product details in items
      .lean();

    const finalData = orders.map((order) => ({
      ...order,
      items: JSON.stringify(order.items), // Convert items array to JSON string
      userId: order.userId?.name || order.userId?.email || "",
      address: order.address
        ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
        : "",
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString() || "",
    }));

    const parser = new AsyncParser({ fields });
    const csv = await parser.parse(finalData).promise();

    await logActivity(admin, "EXPORTED_ORDERS", `exported orders`);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${Date.now()}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
