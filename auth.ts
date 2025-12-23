import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
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
  // Use Supabase adapter to store users and accounts
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  // Configure session strategy
  session: {
    strategy: "jwt", // Use JWT for sessions (stateless)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Authentication providers
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Request user profile information
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

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
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        // Check if user has a password (credentials account)
        if (!user.password_hash) {
          throw new Error(
            "This account uses OAuth login. Please sign in with Google."
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
  ],

  // Callback functions
  callbacks: {
    // JWT callback - called when JWT is created or updated
    async jwt({ token, user, account }) {
      // On initial sign in, add user info to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // Store OAuth provider info
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    // Session callback - called when session is checked
    async session({ session, token }) {
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
