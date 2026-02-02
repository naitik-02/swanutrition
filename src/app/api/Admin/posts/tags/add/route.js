import { connectDb } from "../../../../../../database";
import PostTag from "../../../../../../../models/postTags";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

      if (!admin.permissions.includes("manage_post_tags")) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

    const { name, description, slug } = await req.json();

    const tag = new PostTag({ name, slug, description });
    await tag.save();

    await logActivity(admin, "ADD_POST", `addes post: ${name}`);

    return Response.json({ success: true, tag });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
