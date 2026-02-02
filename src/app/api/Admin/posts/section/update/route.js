import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import BlogPost from "../../../../../../../models/blog";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import uploadFile from "../../../../../../../middlewares/upload";

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

    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!admin.permissions.includes("update_posts")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await req.formData();

    const postId = formData.get("postId");
    const sectionId = formData.get("sectionId");
    const type = formData.get("type");

    if (!postId || !sectionId) {
      return NextResponse.json({ message: "IDs required" }, { status: 400 });
    }

    const post = await BlogPost.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const section = post.sections.id(sectionId);
    if (!section) return NextResponse.json({ message: "Section not found" }, { status: 404 });

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

    if (type) section.type = type;
    section.fields = fieldsArray;

    await post.save();

    return NextResponse.json(
      { message: "Section updated", data: post },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update section error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
