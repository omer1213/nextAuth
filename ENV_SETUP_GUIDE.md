# Environment Variables Setup Guide

## Step-by-Step Guide to Get All Required Credentials

---

## 1️⃣ NEXTAUTH_URL
**What it is:** Your application's URL  
**For development:** `http://localhost:3000`  
**For production:** Your actual domain (e.g., `https://myapp.com`)

✅ **Easy - Just use:** `http://localhost:3000`

---

## 2️⃣ NEXTAUTH_SECRET
**What it is:** A random secret key to encrypt your JWT tokens  
**How to get it:**

### Option 1: Using OpenSSL (if you have it)
```bash
openssl rand -base64 32
```

### Option 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator
- Go to: https://generate-secret.vercel.app/32
- Copy the generated string

✅ **Copy the random string you get**

---

## 3️⃣ SUPABASE Variables (3 variables)

### First: Create a Supabase Project

1. **Go to:** https://supabase.com
2. **Sign up/Login** (free account works fine)
3. **Click:** "New Project"
4. **Fill in:**
   - Project name: `auth-system` (or any name)
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to you
5. **Wait 2-3 minutes** for project to be ready

### Then: Get Your Credentials

1. **Go to:** Your project dashboard
2. **Click:** Settings ⚙️ (bottom left)
3. **Click:** API (in the sidebar)
4. **You'll see:**

   📋 **Project URL** → Copy this for `NEXT_PUBLIC_SUPABASE_URL`
   
   📋 **anon/public** key → Copy this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   📋 **service_role** key (click "Reveal") → Copy this for `SUPABASE_SERVICE_ROLE_KEY`

✅ **Keep these 3 values safe!**

---

## 4️⃣ GOOGLE OAuth Credentials (2 variables)

### Step 1: Go to Google Cloud Console
- Visit: https://console.cloud.google.com

### Step 2: Create a New Project
1. Click the project dropdown (top left)
2. Click "New Project"
3. Name it: `NextAuth App`
4. Click "Create"

### Step 3: Enable Google+ API
1. Go to: "APIs & Services" → "Library"
2. Search: "Google+ API"
3. Click it and press "Enable"

### Step 4: Create OAuth Credentials
1. Go to: "APIs & Services" → "Credentials"
2. Click: "Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen:
   - User Type: External
   - App name: `My Next App`
   - User support email: Your email
   - Developer email: Your email
   - Save and continue (skip optional fields)
4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `NextAuth Client`
   - Authorized JavaScript origins:
     - Add: `http://localhost:3000`
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

### Step 5: Copy Your Credentials
You'll see a popup with:
- 📋 **Client ID** → Copy for `GOOGLE_CLIENT_ID`
- 📋 **Client Secret** → Copy for `GOOGLE_CLIENT_SECRET`

✅ **Save both values!**

---

## 📝 Create Your .env.local File

1. **Create a file** named `.env.local` in `my-next-app` folder
2. **Paste this template:**

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=paste-your-generated-secret-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=paste-your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-supabase-service-role-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=paste-your-google-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-google-client-secret-here
```

3. **Replace** all the "paste-your-..." values with actual credentials
4. **Save the file**

---

## ⚠️ Important Notes

- ✅ Never commit `.env.local` to git (it's already in .gitignore)
- ✅ Never share your `SUPABASE_SERVICE_ROLE_KEY` or `NEXTAUTH_SECRET`
- ✅ For Google OAuth, you can skip it for now and set it up later if needed

---

## 🚀 Quick Start (Minimum Setup)

If you want to start quickly and add Google OAuth later:

**Required for Phase 1:**
- ✅ NEXTAUTH_URL (just use `http://localhost:3000`)
- ✅ NEXTAUTH_SECRET (generate a random string)
- ✅ All 3 Supabase variables (create project first)
- ⏭️ Google OAuth (can be added later)

---

## Need Help?

- Supabase doesn't load? Wait 2-3 minutes after creating project
- Can't find API settings? Look for ⚙️ Settings → API
- Google OAuth confused? We can skip it and add later!


