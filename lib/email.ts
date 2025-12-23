import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address - Resend requires verified domain
// For testing, use onboarding@resend.dev
const FROM_EMAIL = "onboarding@resend.dev";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email address",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 30px 0; border-bottom: 3px solid #2563eb;">
    <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Welcome to Our App!</h1>
  </div>
  
  <!-- Main Content -->
  <div style="padding: 40px 20px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi ${name},</h2>
    
    <p style="font-size: 16px; color: #4b5563;">
      Thanks for signing up! We're excited to have you on board.
    </p>
    
    <p style="font-size: 16px; color: #4b5563;">
      To complete your registration and start using your account, please verify your email address by clicking the button below:
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationLink}" 
         style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
        Verify Email Address
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; color: #4b5563;">
      ${verificationLink}
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>⏰ This link will expire in 24 hours.</strong><br>
        If you didn't create an account, you can safely ignore this email.
      </p>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
    <p style="margin: 5px 0;">
      This email was sent to <strong>${email}</strong>
    </p>
    <p style="margin: 5px 0;">
      © ${new Date().getFullYear()} Your App Name. All rights reserved.
    </p>
  </div>
  
</body>
</html>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    console.log("✅ Verification email sent successfully to:", email);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; padding: 30px 0; border-bottom: 3px solid #dc2626;">
    <h1 style="color: #dc2626; margin: 0; font-size: 28px;">Password Reset Request</h1>
  </div>
  
  <!-- Main Content -->
  <div style="padding: 40px 20px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi ${name || "there"},</h2>
    
    <p style="font-size: 16px; color: #4b5563;">
      We received a request to reset your password. Click the button below to choose a new password:
    </p>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${resetLink}" 
         style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);">
        Reset Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; color: #4b5563;">
      ${resetLink}
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background-color: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        <strong>⏰ This link will expire in 24 hours.</strong><br>
        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
      </p>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
    <p style="margin: 5px 0;">
      This email was sent to <strong>${email}</strong>
    </p>
    <p style="margin: 5px 0;">
      © ${new Date().getFullYear()} Your App Name. All rights reserved.
    </p>
  </div>
  
</body>
</html>
      `,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    console.log("✅ Password reset email sent successfully to:", email);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
}
