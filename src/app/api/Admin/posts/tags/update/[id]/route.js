import { connectDb } from "../../../../../../../database";
import PostTag from "../../../../../../../../models/postTags";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

export async function PUT(req, { params }) {
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

    const { id } = params;
    const { name, description, slug } = await req.json();

    const updatedTag = await PostTag.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );

    if (!updatedTag) {
      return Response.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    await logActivity(admin, "UPDATE_POST_TAG", `updated post tag: ${id}`);

    return Response.json({ success: true, tag: updatedTag });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
