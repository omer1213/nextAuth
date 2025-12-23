import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email, email_verified")
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !user) {
      // Don't reveal if user exists or not (security)
      return NextResponse.json({
        success: true,
        message:
          "If an account with this email exists and is unverified, a new verification link has been sent.",
      });
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json({
        success: true,
        message: "This email is already verified. You can login now.",
      });
    }

    // Delete any existing verification tokens for this email
    await supabase
      .from("verification_tokens")
      .delete()
      .eq("identifier", email.toLowerCase());

    // Generate new verification token
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
        { error: "Failed to send verification link. Please try again." },
        { status: 500 }
      );
    }

    // Send verification email
    try {
      await sendVerificationEmail(
        email.toLowerCase(),
        user.name || "there",
        verificationToken
      );
      console.log("✅ Verification email resent to:", email);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification link sent! Check your email inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
