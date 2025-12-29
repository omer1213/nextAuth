import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // No adapter needed - we use JWT sessions and handle users directly
  // Adapter was only needed for OAuth (which we removed) and database sessions

  // Configure session strategy
  session: {
    strategy: "jwt", // Use JWT for sessions (stateless, no database needed)
    maxAge: 60, // 1 minute (for testing - change back to 30 * 24 * 60 * 60 for production)
    // You can change this to any duration:
    // 1 minute: 60 (current - for testing)
    // 1 hour: 60 * 60
    // 1 day: 24 * 60 * 60
    // 7 days: 7 * 24 * 60 * 60
    // 30 days: 30 * 24 * 60 * 60
    // 90 days: 90 * 24 * 60 * 60
  },

  // Trust host (required for Vercel, safe for localhost)
  trustHost: true,

  // Authentication providers
  providers: [
    // Credentials Provider (Email/Password)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Authorize function to validate credentials
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Query Supabase for user by email
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, name, image, password_hash, email_verified")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        // Check if user has a password (credentials account)
        if (!user.password_hash) {
          throw new Error(
            "This account does not have a password. Please contact support."
          );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified
        if (!user.email_verified) {
          throw new Error(
            "Please verify your email before logging in. Check your email for the verification link."
          );
        }

        // Return user object (without password hash)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.email_verified,
        };
      },
    }),
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Show account selection screen
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // Callback functions
  callbacks: {
    // JWT callback - called when JWT is created or updated
    async jwt({ token, user, account }) {
      // On initial sign in (OAuth or Credentials)
      if (user && account) {
        // OAuth sign in (Google)
        if (account.provider === "google") {
          // Check if user exists in database
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", user.email)
            .single();

          if (existingUser) {
            // User exists - use their ID
            token.id = existingUser.id;
            token.email = existingUser.email;
            token.name = existingUser.name || user.name;
            token.picture = existingUser.image || user.image;
          } else {
            // New OAuth user - create in database
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                email: user.email!,
                name: user.name || null,
                image: user.image || null,
                email_verified: new Date().toISOString(), // OAuth emails are pre-verified
                password_hash: null, // No password for OAuth users
              })
              .select()
              .single();

            if (createError || !newUser) {
              console.error("Error creating OAuth user:", createError);
              throw new Error("Failed to create user account");
            }

            token.id = newUser.id;
            token.email = newUser.email;
            token.name = newUser.name;
            token.picture = newUser.image;
          }
        } else {
          // Credentials sign in - user already exists
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
        }

        // Store OAuth provider info
        token.provider = account.provider;
      }

      return token;
    },

    // Session callback - called when session is checked
    async session({ session, token }) {
      // If token is null (expired), return null session
      if (!token) {
        return null as any;
      }

      // Check if session is expired using session.expires (set by NextAuth based on maxAge)
      const expiresAt = session.expires ? new Date(session.expires) : null;
      const now = new Date();
      
      if (expiresAt && expiresAt < now) {
        // Session is expired - return null to invalidate
        return null as any;
      }

      // Also check token.exp as backup (exp is in seconds, Date.now() is in milliseconds)
      if (token.exp && token.exp * 1000 < Date.now()) {
        // Token is expired - return null to invalidate
        return null as any;
      }

      // Add user info from token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }

      return session;
    },

    // Redirect callback - called after sign in
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after successful login
      if (url.includes("/login") || url.includes("/signup")) {
        return `${baseUrl}/dashboard`;
      }
      // Otherwise redirect to the requested URL
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  // Custom pages
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Redirect to login on error
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
});
