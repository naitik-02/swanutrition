import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import Page from "../../../../../../../../models/page";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import uploadFile from "../../../../../../../../middlewares/upload";

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

export async function POST(req, { params }) {
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

    const { id: pageId } = await params;
    const formData = await req.formData();
    
    const page = await Page.findById(pageId);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const sectionType = formData.get("type");
    if (!sectionType) {
      return NextResponse.json({ message: "Section type is required" }, { status: 400 });
    }

    // Group form data by instance
    const instancesData = {};
    
    // Process all form entries and group by instance
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("fields.")) {
        const fieldPath = key.replace("fields.", "");
        
        // Check if this is from a specific instance (instance_0, instance_1, etc.)
        const instanceMatch = fieldPath.match(/^instance_(\d+)\./);
        if (instanceMatch) {
          const instanceIndex = instanceMatch[1];
          const actualFieldPath = fieldPath.replace(`instance_${instanceIndex}.`, "");
          
          if (!instancesData[instanceIndex]) {
            instancesData[instanceIndex] = {};
          }
          
          if (value instanceof File) {
            // Handle file upload
            try {
              const uploaded = await uploadFile(value);
              setNested(instancesData[instanceIndex], actualFieldPath, uploaded.url);
            } catch (uploadError) {
              console.error("File upload error:", uploadError);
              return NextResponse.json({ message: "File upload failed" }, { status: 500 });
            }
          } else {
            // Handle regular field
            setNested(instancesData[instanceIndex], actualFieldPath, value);
          }
        } else {
          // This is a single instance (no instance prefix)
          if (!instancesData[0]) {
            instancesData[0] = {};
          }
          
          if (value instanceof File) {
            try {
              const uploaded = await uploadFile(value);
              setNested(instancesData[0], fieldPath, uploaded.url);
            } catch (uploadError) {
              console.error("File upload error:", uploadError);
              return NextResponse.json({ message: "File upload failed" }, { status: 500 });
            }
          } else {
            setNested(instancesData[0], fieldPath, value);
          }
        }
      }
    }

    // Convert instances object to array
    const fieldsArray = Object.keys(instancesData)
      .sort((a, b) => parseInt(a) - parseInt(b)) // Sort by instance number
      .map(key => instancesData[key]);

    // Check if section with this type already exists
    const existingSection = page.sections.find(section => section.type === sectionType);
    
    if (existingSection) {
      // Add to existing section's fields array
      existingSection.fields.push(...fieldsArray);
    } else {
      // Create new section
      const newSection = {
        type: sectionType,
        fields: fieldsArray
      };
      page.sections.push(newSection);
    }

    await page.save();

    return NextResponse.json(
      { 
        message: `${fieldsArray.length} ${sectionType} instance(s) added successfully`, 
        data: page 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add section error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}