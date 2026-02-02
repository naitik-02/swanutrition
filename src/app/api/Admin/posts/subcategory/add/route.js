import { NextResponse } from "next/server";
import BlogSubCategory from "../../../../../../../models/blogSubcategory";
import { connectDb } from "../../../../../../database";
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

     if (!admin.permissions.includes("manage_post_categories")) {
                  return NextResponse.json({ error: "Not authorized" }, { status: 403 });
                }

    const formData = await req.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description") || "";
    const parentCategory = formData.get("parentCategory");

    const isExist = await BlogSubCategory.findOne({ slug });
    if (isExist) {
      return NextResponse.json(
        { message: "Subcategory already exists" },
        { status: 409 }
      );
    }

    const created = await BlogSubCategory.create({
      name,
      slug,
      description,
      parentCategory,
    });

       await logActivity(admin, "SUBCATEGORY_ADDED", `subcategory added: ${name}`);


    return NextResponse.json(
      { message: "Subcategory created", data: created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
