import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Page from "../../../../../../../models/page";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import uploadFile from "../../../../../../../middlewares/upload";

// Helper: set nested object values
function setNested(obj, path, value) {
  const keys = path.replace(/\]/g, "").split(/\.|\[/);
  let current = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });
}

export async function PUT(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
     if (!admin.permissions.includes("update_page")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

    const formData = await req.formData();
    const pageId = formData.get("pageId");
    const sectionId = formData.get("sectionId");
    const type = formData.get("type");

    if (!pageId || !sectionId) {
      return NextResponse.json(
        { message: "pageId and sectionId are required" },
        { status: 400 }
      );
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const section = page.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 });
    }

    // Prepare new fields array (instances)
    const instancesData = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("fields.")) {
        const fieldPath = key.replace("fields.", "");
        const instanceMatch = fieldPath.match(/^instance_(\d+)\./);

        if (instanceMatch) {
          const instanceIndex = instanceMatch[1];
          const actualFieldPath = fieldPath.replace(`instance_${instanceIndex}.`, "");

          if (!instancesData[instanceIndex]) instancesData[instanceIndex] = {};

          if (value instanceof File) {
            try {
              const uploaded = await uploadFile(value);
              setNested(instancesData[instanceIndex], actualFieldPath, uploaded.url);
            } catch (e) {
              console.error("File upload error:", e);
              return NextResponse.json({ message: "File upload failed" }, { status: 500 });
            }
          } else {
            setNested(instancesData[instanceIndex], actualFieldPath, value);
          }
        }
      }
    }

    const fieldsArray = Object.keys(instancesData)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => instancesData[key]);

    // Update section
    if (type) section.type = type;
    section.fields = fieldsArray;

    await page.save();

    return NextResponse.json(
      { message: "Section updated successfully", data: page },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update section error:", err.message);
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
