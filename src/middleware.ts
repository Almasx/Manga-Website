import { NextResponse } from "next/server";
import { env } from "env.mjs";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const adminRoutes: string[] = ["/add-comics", "/manage", "/edit"];

    const isAdminRoute = adminRoutes.some((path) => pathname.endsWith(path));
    if (isAdminRoute && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/401", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/user/:path*", "/comics/:path/manage", "/comics/:path/edit"],
};
