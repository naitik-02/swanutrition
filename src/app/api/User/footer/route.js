import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import FooterContent from "../../../../../models/Footer";

export async function GET(req) {
  try {
    await connectDb();
    
    const footer = await FooterContent.findOne({ isActive: true })
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!footer) {
      return NextResponse.json(
        { message: "Footer not found", data: null },
        { status: 200 }
      );
    }

    const filteredFooter = {
      _id: footer._id,
      logo: footer.logo || "",
      isActive: footer.isActive,
      
      menus: footer.menus
        ?.filter((menu) => menu.isActive)
        .map((menu) => ({
          title: menu.title,
          isActive: menu.isActive,
          items: menu.items
            ?.filter((item) => item.isActive)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(({ label, url, order }) => ({ label, url, order })) || [],
        })) || [],
      
      socials: footer.socials
        ?.filter((social) => social.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(({ platform, url, order }) => ({ platform, url, order })) || [],
      
      info: footer.info?.map(({ title, value }) => ({ title, value })) || [],
    };

    return NextResponse.json(
      { data: filteredFooter },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("PUBLIC FOOTER API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch footer", data: null },
      { status: 500 }
    );
  }
}

export const revalidate = 300;