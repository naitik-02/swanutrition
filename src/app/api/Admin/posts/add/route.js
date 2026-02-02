import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import BlogPost from "../../../../../../models/blog";
import CheckAuth from "../../../../../../middlewares/isAuth";
import uploadFile from "../../../../../../middlewares/upload";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("create_posts")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const design = formData.get("design") || "v1";

    const metaTitle = formData.get("metaTitle") || "";
    const metaDescription = formData.get("metaDescription") || "";
    const metaKeywords = formData.get("metaKeywords")
      ? formData.get("metaKeywords").split(",").map((kw) => kw.trim())
      : [];

    const category = formData.get("category");
    const author = formData.get("author") || undefined;

    const status = formData.get("status") || "draft";

    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags"))
      : [];

      console.log(formData)


    let image = "";
    const imageFile = formData.get("featuredImage");
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      image = await uploadFile(imageFile);
      console.log(image)
    }

    if (!title || !slug) {
      return NextResponse.json(
        { message: "Title and slug are required" },
        { status: 400 }
      );
    }

    const isExisting = await BlogPost.findOne({ slug });
    if (isExisting) {
      return NextResponse.json(
        { message: "Post with this slug already exists" },
        { status: 409 }
      );
    }

 const created = await BlogPost.create({
  title,
  slug,
  description,
  design,
  sections: [],
  metaTitle,
  metaDescription,
  metaKeywords,
  category,
  featuredImage: image.url ,
  tags,
  author,
  status,
  publishedAt: new Date(),
});


    await logActivity(admin, "ADD_POST", `Added post: ${title}`);

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
