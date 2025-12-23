# Authentication System Testing Guide

## 🧪 Complete Testing Checklist

This guide covers all authentication flows and edge cases to ensure your system works correctly.

---

## ✅ Test 1: User Registration (Signup Flow)

### Happy Path:
1. Navigate to `/signup`
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm Password: `TestPassword123`
3. Click "Create Account"
4. **Expected:** Redirected to `/dashboard`
5. **Expected:** User menu shows "Test User"

### Error Cases:
- [ ] Short password (< 8 chars) → Shows "Password must be at least 8 characters"
- [ ] Passwords don't match → Shows "Passwords do not match"
- [ ] Invalid email format → Shows "Please enter a valid email address"
- [ ] Duplicate email → Shows "An account with this email already exists"
- [ ] Empty fields → Shows field-specific errors

---

## ✅ Test 2: User Login (Credentials)

### Happy Path:
1. Navigate to `/login`
2. Enter email and password from signup
3. Click "Sign In"
4. **Expected:** Redirected to `/dashboard`
5. **Expected:** Welcome message with user name

### Error Cases:
- [ ] Wrong password → Shows "Invalid email or password"
- [ ] Non-existent email → Shows "Invalid email or password"
- [ ] Empty fields → Form validation prevents submission

---

## ✅ Test 3: Google OAuth Login

### Happy Path:
1. Navigate to `/login`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. **Expected:** Redirected to `/dashboard`
5. **Expected:** User menu shows Google profile info

### Edge Cases:
- [ ] Cancel OAuth → Returns to login page
- [ ] Already have account with same email → Links accounts

---

## ✅ Test 4: Forgot Password Flow

### Happy Path:
1. Navigate to `/forgot-password`
2. Enter email: `test@example.com`
3. Click "Send Reset Link"
4. **Expected:** Success message appears
5. **Expected:** (Dev mode) Reset link shown

### Test Reset:
1. Copy the reset token/link
2. Navigate to `/reset-password/[token]`
3. Enter new password: `NewPassword123`
4. Confirm new password
5. Click "Reset Password"
6. **Expected:** Success message
7. **Expected:** Redirected to `/login`
8. Login with new password
9. **Expected:** Login successful

### Error Cases:
- [ ] Invalid/expired token → Shows "Invalid or expired reset token"
- [ ] Passwords don't match → Shows error
- [ ] Weak password → Shows "Password must be at least 8 characters"

---

## ✅ Test 5: Protected Routes & Middleware

### When Logged OUT:
1. Try to access `/dashboard`
   - **Expected:** Redirect to `/login?callbackUrl=/dashboard`
2. Try to access `/profile`
   - **Expected:** Redirect to `/login?callbackUrl=/profile`

### After Login (with callback):
1. Login after redirect
   - **Expected:** Redirected back to intended page (dashboard/profile)

### When Logged IN:
1. Try to access `/login`
   - **Expected:** Redirect to `/dashboard`
2. Try to access `/signup`
   - **Expected:** Redirect to `/dashboard`

---

## ✅ Test 6: Session Management

### Session Persistence:
1. Login to application
2. Refresh the page
   - **Expected:** Still logged in
3. Close browser and reopen
   - **Expected:** Still logged in (if within 30 days)

### Session Expiration:
1. Wait for JWT expiration (30 days by default)
   - **Expected:** Auto-logout and redirect to login

---

## ✅ Test 7: Navigation & User Menu

### User Menu Dropdown:
1. Click user avatar in navbar
   - **Expected:** Dropdown opens
2. Click outside dropdown
   - **Expected:** Dropdown closes
3. Click "Dashboard"
   - **Expected:** Navigate to dashboard
4. Click "Profile"
   - **Expected:** Navigate to profile
5. Click "Sign Out"
   - **Expected:** Logout and redirect to `/login`

### Auth Status Indicator:
1. When logged in
   - **Expected:** Green "Authenticated" badge
2. When logged out
   - **Expected:** Red "Not Authenticated" badge
3. During session check
   - **Expected:** Gray "Checking..." badge

---

## ✅ Test 8: Profile Page

1. Navigate to `/profile`
2. **Expected:** Shows:
   - User avatar/initials
   - Full name
   - Email address
   - User ID
   - Member since date
   - Protected route badge

---

## ✅ Test 9: Error Handling

### Network Errors:
1. Disconnect internet
2. Try to signup/login
   - **Expected:** Shows "An unexpected error occurred"

### Server Errors:
1. Test with invalid credentials
   - **Expected:** Clear error messages

### Validation Errors:
1. Test all form validations
   - **Expected:** Specific, helpful error messages

---

## ✅ Test 10: Security Checks

### Password Security:
- [ ] Passwords are hashed (never visible in DB)
- [ ] Min 8 characters enforced
- [ ] Password field type="password" (hidden input)

### Session Security:
- [ ] JWT stored in httpOnly cookie
- [ ] No sensitive data in localStorage
- [ ] CSRF protection enabled

### Database Security:
- [ ] Row Level Security enabled on Supabase
- [ ] Service role key not exposed to client
- [ ] Email uniqueness enforced

---

## ✅ Test 11: Responsive Design

### Mobile (< 640px):
- [ ] Login form fits screen
- [ ] Signup form scrollable
- [ ] User menu works
- [ ] Navigation accessible

### Tablet (640px - 1024px):
- [ ] All pages render correctly
- [ ] No horizontal scroll

### Desktop (> 1024px):
- [ ] Proper spacing and layout
- [ ] User menu aligned right

---

## ✅ Test 12: Loading States

### During Authentication:
- [ ] Login button shows "Signing in..." spinner
- [ ] Signup button shows "Creating account..." spinner
- [ ] Disable form during submission

### Session Loading:
- [ ] User menu shows skeleton while loading
- [ ] Auth status shows "Checking..."

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid email or password" on correct credentials
- **Solution:** Check password in database, may need to re-register

### Issue: OAuth callback not working
- **Solution:** Verify redirect URI in Google Console matches exactly

### Issue: Session not persisting
- **Solution:** Check .env.local has correct NEXTAUTH_SECRET

### Issue: Middleware not protecting routes
- **Solution:** Verify middleware.ts is at root level

### Issue: Reset password link not working
- **Solution:** Check token hasn't expired (24 hours)

---

## ✅ Performance Checks

- [ ] Login < 2 seconds
- [ ] Signup < 3 seconds
- [ ] Page navigation < 1 second
- [ ] Middleware redirect < 500ms

---

## 📊 Test Summary

After completing all tests, you should have verified:

✅ **User Registration:** Working with validation  
✅ **User Login:** Credentials + OAuth  
✅ **Password Reset:** Complete flow  
✅ **Protected Routes:** Middleware working  
✅ **Session Management:** Persistence + expiration  
✅ **Navigation:** User menu + routing  
✅ **Security:** Passwords hashed, sessions secure  
✅ **UI/UX:** Responsive, loading states  
✅ **Error Handling:** Clear, helpful messages  

---

## 🎯 Production Readiness Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables set in production
- [ ] Database backups enabled
- [ ] HTTPS enforced
- [ ] Rate limiting on auth endpoints (future)
- [ ] Email service integrated for password reset
- [ ] Error logging configured (Sentry, etc.)
- [ ] Analytics tracking (optional)

---

## 🚀 Next Steps

After testing, consider adding:
1. Email verification on signup
2. Two-factor authentication (2FA)
3. Social login with more providers
4. Role-based access control (RBAC)
5. User profile editing
6. Account deletion

---

**Last Updated:** December 22, 2025  
**Version:** 1.0 - Complete Authentication System
