import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email.toLowerCase())
      .single();

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Save token to database
    const { error: tokenError } = await supabase
      .from("verification_tokens")
      .insert({
        identifier: email.toLowerCase(),
        token: resetToken,
        expires: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Error creating reset token:", tokenError);
      return NextResponse.json(
        { error: "Failed to generate reset token" },
        { status: 500 }
      );
    }

    // In production, you would send an email here with the reset link:
    // const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;
    // await sendEmail(email, "Password Reset", resetLink);

    // For development, we'll just return success
    // You can log the token for testing
    console.log(`Reset token for ${email}: ${resetToken}`);
    console.log(
      `Reset link: ${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`
    );

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
      // REMOVE THIS IN PRODUCTION - only for development/testing
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
