import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Header from "../../../../../models/Header";
import uploadFile from "../../../../../middlewares/upload";
import CheckAuth from "../../../../../middlewares/isAuth";
import { logActivity } from "../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formdata = await req.formData();

    const menusRaw = formdata.get("menus");
    const menus = menusRaw ? JSON.parse(menusRaw) : [];

    const offersRaw = formdata.get("offers");
    const offers = offersRaw
      ? JSON.parse(offersRaw)
      : { isActive: true, items: [] };

    const offersPayload = {
      isActive: offers?.isActive ?? true,
      items: offers?.items || [],
    };

    let logo = "";
    const logoValue = formdata.get("logoFile");
    console.log("logovalue" , formdata)

    if (logoValue && typeof logoValue === "object") {
      if (!logoValue.type?.startsWith("image/")) {
        return NextResponse.json(
          { message: "Logo must be an image" },
          { status: 400 }
        );
      }

      const uploaded = await uploadFile(logoValue);

      if (!uploaded?.url) {
        console.log("UPLOAD RESPONSE:", uploaded);
        return NextResponse.json(
          { message: "Logo upload failed" },
          { status: 500 }
        );
      }

      logo = uploaded.url;
    }

    console.log( "aejornaioernf" , logo)

    const payload = {
      logo,
      menus,
      offers: offersPayload,
    };

    const header = await Header.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    await logActivity(admin, "PUBLISH_HEADER", "Header content updated");

    return NextResponse.json(
      { message: "Header saved successfully", data: header },
      { status: 200 }
    );
  } catch (error) {
    console.log("Header api error", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Server error while saving header" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const header = await Header.findOne({});

    return NextResponse.json({ data: header || null }, { status: 200 });
  } catch (error) {
    console.error("GET HEADER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch header data" },
      { status: 500 }
    );
  }
}
