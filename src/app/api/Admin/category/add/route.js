import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import uploadFile from "../../../../../../middlewares/upload";
import Category from "../../../../../../models/category";
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

    const rawName = formdata.get("name");
    const slug = formdata.get("slug");
    const description = formdata.get("description");
    const image = formdata.get("image");

    const name = rawName?.toString().trim();

    if (!name || !image || !slug) {
      return NextResponse.json(
        { message: "Name and image and slug are required" },
        { status: 400 }
      );
    }

    const isExisting = await Category.findOne({ slug });

    if (isExisting) {
      return NextResponse.json(
        { message: "Category Already Exists" },
        { status: 409 }
      );
    }

    const uploadedImage = await uploadFile(image);
    const imageUrl = uploadedImage?.url || "";

    const created = await Category.create({
      name,
      slug,
      description,
      image: imageUrl,
    });

    await logActivity(admin, "Add_CATEGORY", `add new category : ${name}`);

    return NextResponse.json(
      {
        message: "Category Added Successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Category POST error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
