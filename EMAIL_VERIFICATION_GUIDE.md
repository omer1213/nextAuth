# Email Verification System Guide

## Overview

This authentication system now includes **mandatory email verification** for all email/password signups. Users must verify their email address before they can login.

---

## How It Works

### 1. User Registration Flow

```
User Signs Up → Account Created → Verification Token Generated → 
Email Sent (Dev: Link Shown) → User Must Verify → Then Can Login
```

**Steps:**
1. User fills signup form at `/signup`
2. Account created with `email_verified = NULL`
3. Verification token (32-byte random hex) generated
4. Token stored in `verification_tokens` table (valid 24 hours)
5. In **development**: Link shown on success page
6. In **production**: Send link via email service

### 2. Email Verification Flow

```
User Clicks Link → Token Validated → Email Verified → 
User Redirected to Login
```

**Steps:**
1. User clicks verification link: `/verify-email/[token]`
2. System checks if token exists and hasn't expired
3. Updates `users.email_verified` with current timestamp
4. Deletes used token
5. Redirects to login page with success message

### 3. Login Flow with Verification Check

```
User Tries to Login → Check Email Verified → 
If Not Verified: Show Error + Resend Link → 
If Verified: Allow Login
```

**Steps:**
1. User enters email/password at `/login`
2. System validates credentials
3. **Checks if `email_verified` is not NULL**
4. If unverified: Shows error with link to resend
5. If verified: Login succeeds

---

## Files Created/Modified

### New API Routes:
- `app/api/auth/verify-email/route.ts` - Verify email token
- `app/api/auth/resend-verification/route.ts` - Resend verification link

### New Pages:
- `app/(auth)/verify-email/[token]/page.tsx` - Verification page
- `app/(auth)/resend-verification/page.tsx` - Resend verification page

### Modified Files:
- `app/api/auth/signup/route.ts` - Generate verification token on signup
- `app/(auth)/signup/page.tsx` - Show verification link instead of auto-login
- `app/(auth)/login/page.tsx` - Show resend link if verification error
- `auth.ts` - Check email verified in credentials provider

---

## Development Mode Features

In development (`NODE_ENV === "development"`), the system shows verification links directly:

### After Signup:
```
✅ Account created successfully!
🔧 Development Mode - Click to verify:
[Verify Email Now]
```

### Resend Verification:
```
✅ Verification link sent!
🔧 Development Mode - Verification Link:
http://localhost:3000/verify-email/abc123...
```

This makes testing easier without needing an email service.

---

## Production Setup

For production, you'll need to integrate an email service to send verification emails.

### Recommended Email Services:
1. **Resend** (https://resend.com) - Modern, developer-friendly
2. **SendGrid** (https://sendgrid.com) - Popular, reliable
3. **AWS SES** (https://aws.amazon.com/ses/) - Cost-effective
4. **Mailgun** (https://www.mailgun.com) - Powerful APIs

### Integration Steps:

1. **Install email library:**
```bash
npm install @sendgrid/mail  # or your chosen service
```

2. **Update `app/api/auth/signup/route.ts`:**
```typescript
// After creating verification token:
if (process.env.NODE_ENV === "production") {
  await sendVerificationEmail(email, verificationToken);
}
```

3. **Create email sender function:**
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;
  
  await sgMail.send({
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'Verify your email address',
    html: `
      <h1>Welcome!</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
```

4. **Add to `.env.local`:**
```env
SENDGRID_API_KEY=your_api_key_here
```

---

## Testing the Flow

### Test 1: Complete Signup & Verification

1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm: `TestPassword123`
3. Click "Create Account"
4. **See verification link** (dev mode)
5. Click "Verify Email Now"
6. **See success** message
7. Redirected to `/login`
8. Login with credentials
9. **Success!** Redirected to dashboard

### Test 2: Login Without Verification

1. Create new account (don't verify)
2. Go to `/login`
3. Enter credentials
4. **See error:** "Please verify your email..."
5. Click "Resend verification email"
6. Get new verification link
7. Verify and try again

### Test 3: Expired Token

1. Create account
2. Wait 24+ hours (or manually expire token in DB)
3. Try to verify
4. **See error:** "Verification token has expired"
5. Click "Request New Verification Link"
6. Get new token
7. Verify successfully

---

## Database Schema

### `users` Table:
```sql
email_verified TIMESTAMP WITH TIME ZONE
-- NULL = not verified
-- TIMESTAMP = verified at this time
```

### `verification_tokens` Table:
```sql
identifier VARCHAR(255)  -- User's email
token VARCHAR(255)       -- Random 32-byte hex
expires TIMESTAMP        -- Expiration time (24 hours)
```

---

## Security Considerations

### Token Security:
- ✅ Tokens are 32-byte random hex (256-bit entropy)
- ✅ Tokens expire after 24 hours
- ✅ Used tokens are immediately deleted
- ✅ One token per email (old ones deleted on resend)

### Email Security:
- ✅ Email addresses normalized (lowercase)
- ✅ No indication if email exists on resend (prevents enumeration)
- ✅ Verification required before any login

### Rate Limiting (Future Enhancement):
Consider adding:
- Max 3 verification requests per hour per email
- Max 5 verification attempts per token
- IP-based rate limiting

---

## User Experience

### What Users See:

**Signup Success:**
```
✅ Account created successfully!
   Please verify your email to login.
   
   Check your email for the verification link.
   
   [Go to Login]
```

**Email Verified:**
```
✅ Email verified successfully!
   You can now login.
   
   Redirecting to login page...
```

**Login Without Verification:**
```
❌ Please verify your email before logging in.
   Check your email for the verification link.
   
   Didn't receive the link? [Resend verification email]
```

---

## Troubleshooting

### Issue: "Verification token not found"
**Solution:** Token expired or already used. Request new verification link.

### Issue: Can't login after verification
**Solution:** Check database that `email_verified` is set. May need to verify again.

### Issue: Not receiving verification emails (production)
**Solution:** 
- Check email service credentials
- Verify sender email is verified with service
- Check spam folder
- Review email service logs

---

## Future Enhancements

### Planned Features:
1. **Email Customization:** HTML email templates
2. **Rate Limiting:** Prevent abuse of verification system
3. **Admin Dashboard:** View unverified users, resend in bulk
4. **Email Change:** Require verification for email updates
5. **Welcome Email:** Send after successful verification

### Optional Additions:
- SMS verification as alternative
- Two-factor authentication (2FA)
- Email verification reminders
- Verification progress tracking

---

## API Endpoints

### POST `/api/auth/signup`
Creates account and generates verification token.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created! Please verify your email to login.",
  "requiresVerification": true,
  "verificationLink": "http://localhost:3000/verify-email/token123" // dev only
}
```

### POST `/api/auth/verify-email`
Verifies email using token.

**Request:**
```json
{
  "token": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login."
}
```

### POST `/api/auth/resend-verification`
Resends verification link.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification link sent! Check your email.",
  "verificationLink": "http://localhost:3000/verify-email/token456" // dev only
}
```

---

## Summary

✅ **Email verification is now mandatory**  
✅ **Tokens valid for 24 hours**  
✅ **Dev mode shows links directly**  
✅ **Production-ready architecture**  
✅ **Resend functionality included**  
✅ **Security best practices followed**  

Your authentication system is now more secure and follows industry best practices!

---

**Last Updated:** December 22, 2025  
**Version:** 2.0 - Email Verification Added
