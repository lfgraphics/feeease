import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user needs to change password
    if (token?.requiresPasswordChange) {
      // Allow access to change password page and api
      if (path.startsWith("/auth/change-password") || path.startsWith("/api/auth")) {
        return NextResponse.next();
      }
      // Redirect to change password page
      return NextResponse.redirect(new URL("/auth/change-password", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*", 
    "/school/:path*",
    "/portal/:path*",
  ],
};
