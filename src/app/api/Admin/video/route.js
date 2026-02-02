import { NextResponse } from "next/server";
import Video from "../../../../../models/video";
import { connectDb } from "../../../../database"; 

export async function GET(req) {
  try {
    await connectDb();

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Video.countDocuments(query);

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      videos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
