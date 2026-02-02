import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("adminToken");

  
  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/dashboard-login", req.url));
  }

  return NextResponse.next();
}


