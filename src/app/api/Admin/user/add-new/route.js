import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import User from "../../../../../../models/user";
import CheckAuth from "../../../../../../middlewares/isAuth";
import bcrypt from "bcryptjs";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    // const token = req.cookies.get("adminToken")?.value;
    // const admin = await CheckAuth(token);

    // if (!admin || admin.role !== "admin") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // if (!admin.permissions.includes("create_users")) {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    // }

    const {
      name,
      email,
      phone,
      role,

      password,
     
      permissions = [],
    } = await req.json();

    if (!phone || !role || !name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, phone, role, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this phone or email already exists" },
        { status: 409 }
      );
    }

    // 🔑 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      role,
    
      password: hashedPassword,
    
      permissions,
    });

    // await logActivity(admin, `ADD_USER`, ` ${role} added: ${name}`);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          ...newUser._doc,
          password: undefined,
        },
      },
      { status: 201 }
    );
  } catch (error) {
  console.error("Admin Create User Error:", error.message, error);
  return NextResponse.json(
    { message: error.message || "Internal Server Error" },
    { status: 500 }
  );
}
}
