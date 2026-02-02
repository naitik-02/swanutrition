import { connectDb } from "../../../../../database";
import storeSetting from "../../../../../../models/storeSetting";

export async function GET() {
  try {
    await connectDb();

    const cacheKey = "store:settings";

 
    const settings = await storeSetting.findOne();

    if (!settings) {
      return Response.json(
        {
          success: false,
          message: "No store settings found",
        },
        { status: 404 }
      );
    }



    return Response.json({ settings });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch store settings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
