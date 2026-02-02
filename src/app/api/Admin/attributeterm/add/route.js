import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import uploadFile from "../../../../../../middlewares/upload";
import AttributeTerm from "../../../../../../models/attributeterm";
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

   
    const isExisting = await AttributeTerm.findOne({ name, attribute });
    if (isExisting) {
      return NextResponse.json(
        { error: "Term already exists for this attribute" },
        { status: 409 }
      );
    }

    let imageUrl = "";
    if (image && image.size > 0) {
      const uploadedImage = await uploadFile(image);
      imageUrl = uploadedImage?.url || "";
    }

    const termData = {
      name,
      slug,
      attribute,
    };

    if (colorCode) {
      termData.colorCode = colorCode;
    }

    if (imageUrl) {
      termData.image = imageUrl;
    }

    const created = await AttributeTerm.create(termData);

    // Populate the attribute field for response
    const populatedTerm = await AttributeTerm.findById(created._id).populate(
      "attribute"
    );

        await logActivity(admin, "ADD_ATTRIBUTE_TERM", `add attribute term: ${name}`);


    return NextResponse.json(
      {
        message: "Attribute Term Added Successfully",
        data: populatedTerm,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Attribute Term POST error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
