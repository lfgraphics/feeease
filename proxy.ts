import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

export default withAuth(
  async function middleware(req) {
    // 0. Rate Limiting Logic
    // In Next-Auth v4 middleware, req is NextRequestWithAuth which extends NextRequest
    const ip = (req as any).ip ?? "127.0.0.1";

    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    } catch (error) {
      console.error("Rate limit error:", error);
      // Continue if rate limiting fails (e.g. Redis down)
    }

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
          } else if (token?.role === "marketing") {
            return NextResponse.redirect(new URL("/admin/marketing/dashboard", req.url));
          } else {
            return NextResponse.redirect(new URL("/portal", req.url));
          }
        }
        return null; // Allow access to login page if not authenticated
      }

      // For other /admin routes, check role
      // Allow 'marketing' role to access admin routes (specifically their dashboard)
      if (!token?.role?.includes("admin") && token?.role !== "marketing") {
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
