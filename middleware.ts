import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  
  // Get session
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Define protected routes (routes that require authentication)
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Define auth routes (login, signup, etc.)
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // If user is on a protected route and NOT logged in
  // Redirect to login with callback URL to return after login
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    
    // Check if this is likely an expired session (not first visit)
    const referer = request.headers.get("referer");
    const sessionCookie = request.cookies.get("next-auth.session-token");
    
    // Show expired message if:
    // 1. User has a session cookie (cookie exists but session invalid = expired)
    // 2. User is coming from a protected route (was logged in, now expired)
    // 3. User is refreshing/navigating (referer exists and is same origin)
    const isFromProtectedRoute = referer 
      ? protectedRoutes.some(route => {
          try {
            const refererUrl = new URL(referer);
            return refererUrl.origin === nextUrl.origin && refererUrl.pathname.startsWith(route);
          } catch {
            return false;
          }
        })
      : false;
    
    if (sessionCookie || isFromProtectedRoute || referer) {
      // Likely an expired session, show notification
      loginUrl.searchParams.set("expired", "true");
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access auth pages (login/signup)
  // Redirect them to dashboard since they're already authenticated
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Specify which routes this middleware should run on
// This runs on all routes except API routes, static files, and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
