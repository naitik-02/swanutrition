import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Attribute from "../../../../../../models/attribute";
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

    if (!admin.permissions.includes("manage_attributes")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formdata = await req.formData();
    const rawName = formdata.get("name");
    const slug = formdata.get("slug");
    const type = formdata.get("type");
    const sortOrder = formdata.get("sortOrder");

    const name = rawName?.toString().trim();

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    const isExisting = await Attribute.findOne({ name });
    if (isExisting) {
      return NextResponse.json(
        { error: "Attribute Already Exists" },
        { status: 409 }
      );
    }

    const created = await Attribute.create({
      name,
      slug,
      type,
      sortOrder: sortOrder || "name",
    });

    await logActivity(admin, "ADD_ATTRIBUTE", `added new attribute: ${name}`);

    return NextResponse.json(
      {
        message: "Attribute Added Successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Attribute POST error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
