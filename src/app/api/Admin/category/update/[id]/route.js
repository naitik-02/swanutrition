import { NextResponse } from "next/server";
import Category from "../../../../../../../models/category.js";
import { connectDb } from "../../../../../../database.js";
import uploadFile from "../../../../../../../middlewares/upload.js";
import CheckAuth from "../../../../../../../middlewares/isAuth.js";
import { logActivity } from "../../../../../../utils/logActivity.js";

export async function PATCH(req, { params }) {
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

    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");

    const image = formData.get("image");

    const iscategory = await Category.findById(id);

    if (!iscategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (slug && slug !== iscategory.slug) {
      const duplicate = await Category.findOne({ slug });
      if (duplicate && String(duplicate._id) !== id) {
        return NextResponse.json(
          { message: "Category name already exists" },
          { status: 409 }
        );
      }
      iscategory.slug = slug;
      iscategory.name = name;
    }

    if (image && typeof image === "object" && image.arrayBuffer) {
      const imageurl = await uploadFile(image);
      if (imageurl?.url) {
        iscategory.image = imageurl.url;
      }
    }

    await iscategory.save();

    await logActivity(admin, "UPDATE_CATEGORY", `update category: ${id}`);

    return NextResponse.json({ message: "Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
