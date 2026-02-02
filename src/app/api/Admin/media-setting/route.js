import { connectDb } from "../../../../database";
import MediaSetting from "../../../../../models/mediaSetting";

export async function GET() {
  await connectDb();
  const settings = await MediaSetting.findOne();
  return Response.json(settings || {});
}
