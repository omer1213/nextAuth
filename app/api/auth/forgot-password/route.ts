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
    const { data: tokenData, error: tokenError } = await supabase
      .from("verification_tokens")
      .insert({
        identifier: email.toLowerCase(),
        token: resetToken,
        expires: expiresAt.toISOString(),
      })
      .select();

    if (tokenError) {
      // Log error without sensitive data
      if (process.env.NODE_ENV === "development") {
        console.error("Error creating reset token:", tokenError.message);
      }
      return NextResponse.json(
        { error: "Failed to generate reset token" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    // Log error without sensitive data
    if (process.env.NODE_ENV === "development") {
      console.error("Forgot password error");
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
