import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import uploadFile from "../../../../../../../middlewares/upload";
import AttributeTerm from "../../../../../../../models/attributeterm";
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
    const attribute = formdata.get("attribute");
    const colorCode = formdata.get("colorCode");
    const image = formdata.get("image");

    const name = rawName?.toString().trim();

    if (!name || !attribute) {
      return NextResponse.json(
        { error: "Name and attribute are required" },
        { status: 400 }
      );
    }

    const attributeExists = await Attribute.findById(attribute);
    if (!attributeExists) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    // Check if term name already exists for this attribute (excluding current term)
    const isExisting = await AttributeTerm.findOne({
      name,
      attribute,
      _id: { $ne: id },
    });
    if (isExisting) {
      return NextResponse.json(
        { error: "Term name already exists for this attribute" },
        { status: 409 }
      );
    }

    const updateData = {
      name,
      slug,
      attribute,
    };

    if (colorCode) {
      updateData.colorCode = colorCode;
    }

    // Handle image upload if new image is provided
    if (image && image.size > 0) {
      const uploadedImage = await uploadFile(image);
      updateData.image = uploadedImage?.url || "";
    }

    const updated = await AttributeTerm.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("attribute");

    if (!updated) {
      return NextResponse.json(
        { error: "Attribute Term not found" },
        { status: 404 }
      );
    }

    await logActivity(admin, "UPDATE_TERM", `update attribute term: ${id}`);

    return NextResponse.json(
      {
        message: "Attribute Term Updated Successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute Term PATCH error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
