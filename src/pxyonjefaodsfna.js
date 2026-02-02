import { NextResponse } from "next/server";

export default function proxy(req) {
  const token = req.cookies.get("adminToken");
  console.log("token", token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/dashboard-login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
