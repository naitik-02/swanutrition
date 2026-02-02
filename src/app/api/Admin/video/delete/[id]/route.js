import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import video from "../../../../../../../models/video";

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    console.log("adminToken:", req.cookies.get("adminToken")?.value);


    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const IsVideo = await video.findById(id);

    if (!IsVideo) {
      return NextResponse.json(
        {
          message: "Invalid Video",
        },
        { status: 401 }
      );
    }

    const deleted = await video.findByIdAndDelete(id);

    if (deleted) {
      return NextResponse.json(
        {
          message: "Deleted",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "something went wrong",
      },
      { status: 500 }
    );
  }
}
