import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

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
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access auth pages (login/signup)
  // Redirect them to dashboard since they're already authenticated
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  // Allow the request to continue
  return NextResponse.next();
});

// Specify which routes this middleware should run on
// This runs on all routes except API routes, static files, and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
