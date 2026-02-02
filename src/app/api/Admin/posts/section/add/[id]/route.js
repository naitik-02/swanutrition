import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../../database";
import BlogPost from "../../../../../../../../models/blog";
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

    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!admin.permissions.includes("update_posts")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id: postId } = params;
    const formData = await req.formData();

    const post = await BlogPost.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const sectionType = formData.get("type");
    if (!sectionType) {
      return NextResponse.json({ message: "Section type is required" }, { status: 400 });
    }

    const instancesData = {};

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("fields.")) continue;

      const fieldPath = key.replace("fields.", "");
      const instanceMatch = fieldPath.match(/^instance_(\d+)\./);

      if (instanceMatch) {
        const index = instanceMatch[1];
        const actualPath = fieldPath.replace(`instance_${index}.`, "");

        if (!instancesData[index]) instancesData[index] = {};

        if (value instanceof File) {
          const uploaded = await uploadFile(value);
          setNested(instancesData[index], actualPath, uploaded.url);
        } else {
          setNested(instancesData[index], actualPath, value);
        }
      }
    }

    const fieldsArray = Object.keys(instancesData)
      .sort((a, b) => a - b)
      .map(k => instancesData[k]);

    const existingSection = post.sections.find(s => s.type === sectionType);

    if (existingSection) {
      existingSection.fields.push(...fieldsArray);
    } else {
      post.sections.push({ type: sectionType, fields: fieldsArray });
    }

    await post.save();

    return NextResponse.json(
      { message: "Section added", data: post },
      { status: 201 }
    );
  } catch (err) {
    console.error("Add section error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
