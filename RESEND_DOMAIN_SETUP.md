# Resend Domain Setup Guide (For Future)

## 🎯 When You're Ready to Add a Custom Domain

Once you buy a custom domain (like `myapp.com`), follow these steps to enable email verification for ALL users:

---

## 📋 Step-by-Step Guide

### Step 1: Buy a Domain (If You Don't Have One)

**Recommended Providers:**
- **Namecheap** - ~$8-12/year (.com)
- **Google Domains** - ~$12/year
- **Cloudflare** - ~$10/year
- **GoDaddy** - ~$10-15/year

**Buy any domain you like!** (e.g., `myapp.com`, `yourapp.io`, etc.)

---

### Step 2: Add Domain to Resend

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `myapp.com`)
4. Click **"Add"**

---

### Step 3: Add DNS Records

Resend will show you DNS records to add. You'll need to add these to your domain registrar:

**Example Records:**
```
Type: TXT
Name: @
Value: (Resend will provide this)

Type: CNAME
Name: resend._domainkey
Value: (Resend will provide this)
```

**Where to Add:**
- If using **Namecheap**: Domain List → Manage → Advanced DNS
- If using **Google Domains**: DNS → Custom Records
- If using **Cloudflare**: DNS → Add Record
- If using **GoDaddy**: DNS Management → Add Record

**Add each record exactly as Resend shows you!**

---

### Step 4: Wait for Verification

1. After adding DNS records, wait **5-30 minutes**
2. Go back to Resend → Domains
3. Click **"Verify"** or wait for auto-verification
4. Status will change to **"Verified"** ✅

---

### Step 5: Update Your Code

Once domain is verified, update `lib/email.ts`:

**Change this line:**
```typescript
const FROM_EMAIL = "onboarding@resend.dev";
```

**To:**
```typescript
const FROM_EMAIL = "noreply@yourdomain.com";  // Use your verified domain
```

**Example:**
```typescript
const FROM_EMAIL = "noreply@myapp.com";
```

---

### Step 6: Update Environment Variables

**In `.env.local`:**
```env
# No changes needed - RESEND_API_KEY stays the same
RESEND_API_KEY=re_your_key_here
```

**In Vercel:**
- No changes needed - same API key works!

---

### Step 7: Redeploy

1. Commit the code change
2. Push to GitHub
3. Vercel auto-deploys
4. **Done!** ✅

---

## ✅ After Setup:

- ✅ **Emails work for EVERYONE**
- ✅ **No more "test mode" restrictions**
- ✅ **Professional email addresses**
- ✅ **Better deliverability**
- ✅ **Production ready!**

---

## 🎯 Current Status:

**Right Now:**
- ✅ Resend works for your email (omeryahya1213@gmail.com)
- ✅ Fallback links work for others
- ✅ System is functional

**After Domain Setup:**
- ✅ Emails work for EVERYONE
- ✅ Professional setup
- ✅ Production ready

---

## 💡 Tips:

1. **Domain Cost:** ~$10-12/year (very affordable!)
2. **DNS Propagation:** Usually 5-30 minutes
3. **Resend Free Tier:** 3,000 emails/month (plenty for most apps)
4. **Email Address:** Use `noreply@yourdomain.com` or `hello@yourdomain.com`

---

**You're all set! When you're ready to add a domain, just follow these steps!** 🚀
