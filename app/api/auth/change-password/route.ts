import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(". ") },
        { status: 400 }
      );
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", session.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { error: "This account does not have a password set" },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    // Log error without sensitive data
    if (process.env.NODE_ENV === "development") {
      console.error("Change password error");
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
