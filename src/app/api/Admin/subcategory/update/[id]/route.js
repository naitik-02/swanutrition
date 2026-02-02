import { NextResponse } from "next/server";
import Subcategory from "../../../../../../../models/subcategory";
import { connectDb } from "../../../../../../database";
import uploadFile from "../../../../../../../middlewares/upload";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

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

    const { id } = params;
    const formData = await req.formData();

    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const image = formData.get("image");

    const isSubcategory = await Subcategory.findById(id);

    if (!isSubcategory) {
      return NextResponse.json(
        { message: "Subcategory not found" },
        { status: 404 }
      );
    }

    if (slug && slug !== isSubcategory.slug) {
      const duplicate = await Subcategory.findOne({ name });
      if (duplicate && String(duplicate._id) !== id) {
        return NextResponse.json(
          { message: "Subcategory name already exists" },
          { status: 409 }
        );
      }
      isSubcategory.slug = slug;
      isSubcategory.name = name;
    }

    if (description) {
      isSubcategory.description = description;
    }

    if (image && typeof image === "object" && image.arrayBuffer) {
      const imageUrl = await uploadFile(image);
      if (imageUrl?.url) {
        isSubcategory.image = imageUrl.url;
      }
    }

    await isSubcategory.save();

    await logActivity(
      admin,
      "UPDATE_PRODUCT_SUBCATEGORY",
      `updated product Subcategory: ${id}`
    );

    return NextResponse.json({ message: "updated " }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
