import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Attribute from "../../../../../../models/attribute";
import AttributeTerm from "../../../../../../models/attributeterm";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function DELETE(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("manage_attributes")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Attribute ID is required" },
        { status: 400 }
      );
    }

    await AttributeTerm.deleteMany({ attribute: id });

    const deleted = await Attribute.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

        await logActivity(admin, "DELETE_ATTRIBUTE", `delete attribute: ${id}`);
    

    return NextResponse.json(
      {
        message: "Attribute and all associated terms deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Attribute DELETE error:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
