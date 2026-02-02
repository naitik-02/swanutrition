import { AsyncParser } from "@json2csv/node";
import mongoose from "mongoose";
import { connectDb } from "../../../../../database";
import Product from "../../../../../../models/product";
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

    const { searchParams } = req.nextUrl;

    const catRepeat = searchParams.getAll("category");
    const catComma = searchParams.get("categories")?.split(",") || [];
    const catIds = [...new Set([...catRepeat, ...catComma])].filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    const filter = {};
    if (catIds.length) filter.category = { $in: catIds };

    const body = await req.json();
    let selectedFields = body.fields || ["title", "slug", "stock"];

    const fieldMap = {
      category: "category.name",
      subcategory: "subcategory.name",
      brand: "brand.name",
      returnPolicy: "returnPolicy.notes",
      returnable: "returnPolicy.returnable",
      units: "units",
    };

    const fields = selectedFields.map((f) => fieldMap[f] || f);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("brand", "name")
      .lean();

    const finalData = products.map((p) => ({
      ...p,
      units: JSON.stringify(p.units),
      images: JSON.stringify(p.images),
      category: p.category?.name || "",
      subcategory: p.subcategory?.name || "",
      brand: p.brand?.name || "",
    }));

    const parser = new AsyncParser({ fields });
    const csv = await parser.parse(finalData).promise();


           await logActivity(admin, "EXPORT_PRODUCTS", `exported products`);
    

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products-${Date.now()}.csv"`,
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
