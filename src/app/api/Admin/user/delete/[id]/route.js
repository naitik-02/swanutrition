import { NextResponse } from "next/server";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import User from "../../../../../../../models/user";
import { connectDb } from "@/database";
import { logActivity } from "@/utils/logActivity";

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    const user = await CheckAuth(token);

    const { id } = params.id;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("delete_users")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await connectDb();
    await User.findByIdAndDelete(id);

    await logActivity(admin, `DELETE_USER`, ` user deleted: ${id}`);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
