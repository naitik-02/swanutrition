import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { connectDb } from "../../../../../database";
import Product from "../../../../../../models/product";
import uploadVideo from "../../../../../../middlewares/videoUpload";
import Video from "../../../../../../models/video";

export async function POST(req) {
  try {
    await  connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formdata = await req.formData();

    const title = formdata.get("title");
    const slug = formdata.get("slug");
    const productSlug = formdata.get("product");
    const video = formdata.get("video");

    const isProduct = await Product.findOne({ slug: productSlug });

    if (!isProduct) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 402 }
      );
    }


    let videoUrl;
    if (video) {
      videoUrl = await uploadVideo(video);
    }

    console.log(videoUrl)



    const created = await Video.create({
      title,
      slug,
      product: isProduct._id,
      video: videoUrl.url,
    });

    return NextResponse.json({
      message: "video added successfully",
      video: created,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
