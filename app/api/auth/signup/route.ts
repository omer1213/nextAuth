import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength (min 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user in database (email_verified will be NULL)
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        email_verified: null, // Not verified yet
      })
      .select()
      .single();

    if (createError || !newUser) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

    // Store verification token
    const { error: tokenError } = await supabase
      .from("verification_tokens")
      .insert({
        identifier: email.toLowerCase(),
        token: verificationToken,
        expires: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error creating verification token:", tokenError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    // Send verification email
    let emailSent = false;
    let verificationLink = "";
    
    try {
      await sendVerificationEmail(
        email.toLowerCase(),
        name,
        verificationToken
      );
      emailSent = true;
      console.log("✅ Verification email sent to:", email);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // In development, provide the link as fallback
      verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${verificationToken}`;
      console.log("⚠️ Email failed, verification link:", verificationLink);
    }

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Account created successfully! Check your email for the verification link."
          : "Account created! Email couldn't be sent. Use the link below or resend verification.",
        requiresVerification: true,
        emailSent,
        // Provide link as fallback if email fails
        verificationLink: !emailSent ? verificationLink : undefined,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
