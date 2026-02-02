import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import BlogPost from "../../../../../../../models/blog";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import uploadFile from "../../../../../../../middlewares/upload";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PUT(req, { params }) {
  try {
    await connectDb();

    // Auth check
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("update_posts")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = params;
    const formData = await req.formData();
    const post = await BlogPost.findById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Extract Data
    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    
    const design = formData.get("design");
    const status = formData.get("status");

    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const metaKeywords = formData.get("metaKeywords")
      ? formData.get("metaKeywords").split(",").map((kw) => kw.trim())
      : undefined;

    const category = formData.get("category");
    const author = formData.get("author");

    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags"))
      : undefined;

    const imageFile = formData.get("featuredImage");
    if (imageFile && typeof imageFile === "object") {
      const imageUrl = await uploadFile(imageFile);
      post.featuredImage = imageUrl;
    }

    if (slug && slug !== post.slug) {
      const exists = await BlogPost.findOne({
        slug: slug,
        _id: { $ne: id },
      });
      if (exists) {
        return NextResponse.json(
          { message: "Slug already exists" },
          { status: 409 }
        );
      }
      post.slug = slug;
    }

    if (title !== null) post.title = title;
    if (design !== null) post.design = design;
    if (status !== null) post.status = status;
    if (description !== null) post.description = description;

    if (metaTitle !== null) post.metaTitle = metaTitle;
    if (metaDescription !== null) post.metaDescription = metaDescription;
    if (metaKeywords) post.metaKeywords = metaKeywords;

    if (category) post.category = category;
    if (author) post.author = author;
    if (publishedAt) post.publishedAt = new Date();;
    if (tags) post.tags = tags;

    
    post.updatedAt = new Date();
    await post.save();

    await logActivity(admin, "UPDATE_POST", `Updated post: ${post.title}`);

    return NextResponse.json(
      {
        message: "Post Updated Successfully",
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
