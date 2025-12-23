import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Get the current session from the server
 * Use this in Server Components and Server Actions
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Require authentication - throws error if not authenticated
 * Use this to protect server actions and API routes
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized - Please sign in");
  }

  return session;
}

/**
 * Get current user with full data from database
 * Returns user object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, image, email_verified, created_at")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Redirect to login if not authenticated (for pages)
 * Use this at the top of pages that require authentication
 */
export async function requireAuthPage(redirectTo?: string) {
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = redirectTo || "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

/**
 * Check if user is authenticated
 * Returns boolean - useful for conditional rendering
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}
