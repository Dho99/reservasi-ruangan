import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes (tidak perlu auth)
  const publicRoutes = [
    "/",
    "/user/login",
    "/user/register",
    "/admin/login",
    "/unauthorized",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Jika belum login, redirect ke login
  if (!session) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/user/login", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRole = session.user?.role;

  // Check role-based access
  if (pathname.startsWith("/admin")) {
    // Admin routes hanya untuk ADMIN
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized?type=admin", req.url));
    }
  }

  if (
    pathname.startsWith("/user") &&
    !pathname.startsWith("/user/login") &&
    !pathname.startsWith("/user/register")
  ) {
    // User routes hanya untuk MAHASISWA
    if (userRole !== "MAHASISWA") {
      return NextResponse.redirect(new URL("/unauthorized?type=user", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
