import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Video from "../../../../../../../models/video";

export async function PATCH(req, context ) {
  try {
    await connectDb();

 const { id } = await context.params;

    const updated = await Video.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Liked successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.log("LIKE API ERROR:", error);
    return NextResponse.json(
      { message: "Server error while liking video" },
      { status: 500 }
    );
  }
}
