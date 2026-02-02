import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import uploadFile from "../../../../../../middlewares/upload";
import Subcategory from "../../../../../../models/subcategory.js";
import Category from "../../../../../../models/category.js";
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

    // if (!admin.permissions.includes("manage_product_categories")) {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    // }

    const formdata = await req.formData();

    const name = formdata.get("name");
    const slug = formdata.get("slug");
    const category = formdata.get("category");
    const description = formdata.get("description");
    const image = formdata.get("image");

    let imageUrl = "";

    if (image) {
      const uploaded = await uploadFile(image);
      imageUrl = uploaded?.url || "";
    }

    const iscategory = await Category.findById(category);

    if (!iscategory) {
      return NextResponse.json({
        message: "caegory id invalid",
      });
    }

    const isexisting = await Subcategory.findOne({ slug, category });

    if (isexisting) {
      return NextResponse.json({
        message: "Already Exist",
      });
    }

    const sub = await Subcategory.create({
      name,
      slug,
      image: imageUrl,
      category,
      description,
    });

    await logActivity(
      admin,
      "ADD_PRODUCT_SUBCATEGORY",
      `added product Subcategory: ${name}`
    );

    return NextResponse.json({
      message: "Subcategory added",
      data: sub,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
