import { connectDb } from "../../../../../../../database";
import PostTag from "../../../../../../../../models/postTags";
import CheckAuth from "../../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../../utils/logActivity";

export async function DELETE(req, { params }) {
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

    const deletedTag = await PostTag.findByIdAndDelete(id);

    if (!deletedTag) {
      return Response.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

           await logActivity(admin, "DELETE_TAG", `tag deleted: ${id}`);
    

    return Response.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
