import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Page from "../../../../../../../models/page";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PUT(req, { params }) {
  try {
    await connectDb();
   
    // ✅ Admin authentication
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

     if (!admin.permissions.includes("update_page")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }
    
    const { id } = await params;
    const body = await req.json();
    const { 
      title,        // Changed from name to title
      slug, 
      status, 
      design,
      description,
      metaTitle,
      metaDescription,
      metaKeywords
    } = body;
   
    // ✅ Find page by ID
    const page = await Page.findById(id);
    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }
   
    // ✅ Check slug uniqueness if slug is being changed
    if (slug && slug !== page.slug) {
      const isExisting = await Page.findOne({ slug, _id: { $ne: id } });
      if (isExisting) {
        return NextResponse.json(
          { message: "Slug already exists" },
          { status: 409 }
        );
      }
    }
    
    // ✅ Update fields conditionally
    if (title !== undefined) page.title = title;  // Changed from name to title
    if (slug !== undefined) page.slug = slug;
    if (status !== undefined) page.status = status;
    if (design !== undefined) page.design = design;

    if (description !== undefined) page.description = description;
    
    // ✅ Update SEO fields
    if (metaTitle !== undefined) {
      page.metaTitle = metaTitle;
      if (page.seo) {
        page.seo.metaTitle = metaTitle;
      } else {
        page.seo = { metaTitle, metaDescription: "", metaKeywords: [] };
      }
    }
    
    if (metaDescription !== undefined) {
      page.metaDescription = metaDescription;
      // Also update nested seo object if it exists
      if (page.seo) {
        page.seo.metaDescription = metaDescription;
      } else {
        page.seo = { metaTitle: "", metaDescription, metaKeywords: [] };
      }
    }
    
    if (metaKeywords !== undefined) {
      const keywordsArray = Array.isArray(metaKeywords) ? metaKeywords : [];
      page.metaKeywords = keywordsArray;
      // Also update nested seo object if it exists
      if (page.seo) {
        page.seo.metaKeywords = keywordsArray;
      } else {
        page.seo = { metaTitle: "", metaDescription: "", metaKeywords: keywordsArray };
      }
    }
    
    // ✅ Update timestamps
    page.updatedAt = new Date();
    
    await page.save();
   
    await logActivity(admin, "UPDATE_PAGE", `updated page: ${page.title}`);
    
    return NextResponse.json(
      {
        message: "Page Updated Successfully",
        data: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Page PUT error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}