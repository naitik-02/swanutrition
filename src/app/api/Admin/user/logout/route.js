// api/Admin/user/logout/route.js  (admin logout)
import { NextResponse } from "next/server";

export async function POST() {

  
  const res = NextResponse.json(
    { message: "Admin logged out" },
    { status: 200 }
  );

  res.cookies.set("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return res;
}
