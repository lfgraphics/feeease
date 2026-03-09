import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const isAuth = !!token;

    // 1. Handle Admin Routes Protection
    if (path.startsWith("/admin")) {
        const isAdminLogin = path.startsWith("/admin/login");

        if (isAdminLogin) {
            if (isAuth) {
                // If already logged in, redirect based on role
                if (token?.role?.includes("admin")) {
                    return NextResponse.redirect(new URL("/admin", req.url));
                } else {
                    return NextResponse.redirect(new URL("/portal", req.url));
                }
            }
            return null; // Allow access to login page if not authenticated
        }

        // For other /admin routes, check role
        if (!token?.role?.includes("admin")) {
            // Redirect unauthorized users (like school_owners) to their portal
            return NextResponse.redirect(new URL("/portal", req.url));
        }
    }

    // 2. Check if user needs to change password (global check for all protected routes)
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
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        
        // Always allow access to the admin login page
        if (path.startsWith("/admin/login")) {
            return true;
        }
        
        // For other matched routes, require a token
        return !!token;
      },
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
