import { env } from "env/server.mjs";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },

  {
    secret: env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const adminRoutes: string[] = ["/add-comics", "/add-chapter", "/edit"];

        const isAdminRoute = adminRoutes.every((path) =>
          path.endsWith(pathname)
        );

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*",
    "/comics/:path/chapter/:path/add-chapter",
    "/comics/:path/chapter/:path/edit",
  ],
};
