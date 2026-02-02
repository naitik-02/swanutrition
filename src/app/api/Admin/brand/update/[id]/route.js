import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import uploadFile from "../../../../../../../middlewares/upload";
import Brand from "../../../../../../../models/brand";
import CheckAuth from "../../../../../../../middlewares/isAuth";

export async function PUT(req, { params }) {
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

    const id = params.id;
    const formdata = await req.formData();

    const name = formdata.get("name");
    const slug = formdata.get("slug");
    const description = formdata.get("description");
    const image = formdata.get("image");

    if (!name) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const existing = await Brand.findById(id);
    if (!existing) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    let imageUrl = existing.image;

    if (image && typeof image === "object" && image.arrayBuffer) {
      const uploaded = await uploadFile(image);
      imageUrl = uploaded?.url || imageUrl;
    }

    existing.name = name;
    existing.slug = slug;
    existing.description = description;
    existing.image = imageUrl;

    await existing.save();

    await logActivity(admin, "UPDATE_BRAND", `update brand : ${name}`);

    return NextResponse.json(
      {
        message: "Brand Updated Successfully",
        data: existing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Brand PUT error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
