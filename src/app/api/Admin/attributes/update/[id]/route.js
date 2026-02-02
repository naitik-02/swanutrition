import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Attribute from "../../../../../../../models/attribute";
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

    if (!admin.permissions.includes("manage_attributes")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = params;
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

    const isExisting = await Attribute.findOne({ name, _id: { $ne: id } });
    if (isExisting) {
      return NextResponse.json(
        { error: "Attribute name already exists" },
        { status: 409 }
      );
    }

    const updated = await Attribute.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        type,
        sortOrder: sortOrder || "name",
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    await logActivity(admin, "UPDATE_ATTRIBUTE", `updated attribute: ${name}`);

    return NextResponse.json(
      {
        message: "Attribute Updated Successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute PATCH error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
