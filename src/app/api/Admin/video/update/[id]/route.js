import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import video from "../../../../../../../models/video";
import Product from "../../../../../../../models/product";
import uploadFile from "../../../../../../../middlewares/upload";

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = params;

    const formdata = await req.formdata();

    const title = formdata.get("title");
    const isActive = formdata.get("isActive");
    const slug = formdata.get("slug");
    const videoFile = formdata.get("video");
    const productId = formdata.get("productId");

    const IsVideo = await video.findById(id);

    if (!IsVideo) {
      return NextResponse.json(
        {
          message: "Invalid Video",
        },
        { status: 401 }
      );
    }

    if (productId) {
      const isValidProduct = await Product.findById(productId);

      if (!isValidProduct) {
        return NextResponse.json({
          message: "Product not valid",
        });
      }
    }

    let videoUrl;
    if (videoFile) {
      videoUrl = await uploadVideo(videoFile);
      IsVideo.video = videoUrl.url;
    }

    if (title) {
      video.title = title;
    }
    if (slug) {
      video.slug = slug;
    }
    if (productId) {
      video.product = productId;
    }
    if (isActive) {
      video.isActive = isActive;
    }

    await IsVideo.save();

    return NextResponse.json({
      message: "Updated",
      video: IsVideo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "something went wrong",
      },
      { status: 500 }
    );
  }
}
