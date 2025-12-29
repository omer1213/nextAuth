import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(". ") },
        { status: 400 }
      );
    }

    // Find and verify token
    const { data: verificationToken, error: tokenError } = await supabase
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    const tokenExpiry = new Date(verificationToken.expires);
    if (tokenExpiry < new Date()) {
      // Delete expired token
      await supabase
        .from("verification_tokens")
        .delete()
        .eq("token", token);

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Find user by email from token
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", verificationToken.identifier)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Delete used token
    await supabase
      .from("verification_tokens")
      .delete()
      .eq("token", token);

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    // Log error without sensitive data
    if (process.env.NODE_ENV === "development") {
      console.error("Reset password error");
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
