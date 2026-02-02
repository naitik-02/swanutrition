import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Page from "../../../../../../models/page";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();
    
    // ✅ Admin authentication
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    
        if (!admin.permissions.includes("add_page")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }
    
    
    // ✅ Get JSON body
    const body = await req.json();
    const { 
      title, 
      slug, 
      design ,
      metaTitle, 
      metaDescription, 
      metaKeywords, 
      status,
      description 
    } = body;
    console.log(body)

    // ✅ Validation
    if (!title || !slug) {
      return NextResponse.json(
        { message: "Title and slug are required" },
        { status: 400 }
      );
    }
    
    // ✅ Slug check
    const isExisting = await Page.findOne({ slug });
    if (isExisting) {
      return NextResponse.json(
        { message: "Page with this slug already exists" },
        { status: 409 }
      );
    }
    
    // ✅ Create Page with updated structure
    const created = await Page.create({
      title, // Changed from name to title
      slug,
      design,
      description: description || "",
      status: status || "draft",
     
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
    });

    await logActivity(admin, "ADD_PAGE", `added new page: ${title}`);
    
    return NextResponse.json(
      {
        message: "Page Created Successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Page POST error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}