import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import uploadFile from "../../../../../../middlewares/upload";
import Brand from "../../../../../../models/brand";
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


    if (!admin.permissions.includes("manage_brands")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

    const formdata = await req.formData();

    const name = formdata.get("name");
    const slug = formdata.get("slug");
    const description = formdata.get("description");
    const image = formdata.get("image");

    if (!name || !image) {
      return NextResponse.json(
        { message: "Name and image are required" },
        { status: 400 }
      );
    }

    const isExisting = await Brand.findOne({ slug });

    if (isExisting) {
      return NextResponse.json(
        { message: "Brand Already Exists" },
        { status: 409 }
      );
    }

    let imageUrl;
    if (image) {
      imageUrl = await uploadFile(image);
    }

    const created = await Brand.create({
      name,
      slug,
      description,
      image: imageUrl.url,
    });

    await logActivity(admin, "ADD_BRAND", `add new brand : ${name}`);

    return NextResponse.json(
      {
        message: "Brand Added Successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Brand POST error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
