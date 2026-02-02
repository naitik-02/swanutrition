import { connectDb } from "../../../../../database";
import MediaSetting from "../../../../../../models/mediaSetting";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function PUT(req) {
  await connectDb();

  const token = req.cookies.get("adminToken")?.value;
  const admin = await CheckAuth(token);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!admin.permissions.includes("manage_media_settings")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await MediaSetting.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });

  await logActivity(admin, "UPDATED_MEDIA_SETTING", `updated media setting`);

  return Response.json(updated);
}
