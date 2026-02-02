import { connectDb } from "../../../../../../database";
import BlogCategory from "../../../../../../../models/blogCategory";
import { NextResponse } from "next/server";
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

    const isExist = await BlogCategory.findOne({ slug });
    if (isExist) {
      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    }

    const created = await BlogCategory.create({ name, slug, description });

       await logActivity(admin, "ADD_POST_CATEGORY", `added post category ${name}`);


    return NextResponse.json(
      { message: "Category created", data: created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
