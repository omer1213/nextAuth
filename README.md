# NextAuth + Supabase Authentication System

A complete, production-ready authentication system built with Next.js 16, NextAuth.js v5, and Supabase.

## Features

- Email & Password Authentication
- Google OAuth Integration
- Password Reset Flow
- Protected Routes with Middleware
- Session Management (JWT)
- User Profile Management
- Responsive UI with Tailwind CSS
- TypeScript Support
- Comprehensive Error Handling

## Tech Stack

- **Framework:** Next.js 16.1.0 (App Router)
- **Authentication:** NextAuth.js v5
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Password Hashing:** bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Cloud Console account (for OAuth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omer1213/nextAuth.git
   cd nextAuth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
   
   For detailed setup instructions, see the Supabase and Google Cloud Console documentation.

4. **Set up the database:**
   
   Run the SQL migration in your Supabase SQL Editor:
   ```bash
   # Copy contents from supabase/migrations/001_auth_schema.sql
   # Paste and run in Supabase SQL Editor
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open the application:**
   
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-next-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── forgot-password/      # Password reset request
│   │   └── reset-password/       # Password reset confirmation
│   ├── api/                      # API routes
│   │   └── auth/                 # Auth API endpoints
│   ├── dashboard/                # Protected dashboard
│   ├── profile/                  # Protected profile page
│   └── layout.tsx                # Root layout
├── components/                   # Reusable components
│   ├── user-menu.tsx             # User dropdown menu
│   ├── navbar.tsx                # Navigation bar
│   ├── auth-status.tsx           # Auth status indicator
│   ├── form-input.tsx            # Form input component
│   ├── submit-button.tsx         # Submit button with loading
│   ├── alert-message.tsx         # Alert component
│   └── session-provider.tsx      # Session provider wrapper
├── lib/                          # Utility functions
│   └── auth-helpers.ts           # Auth helper functions
├── supabase/                     # Database
│   └── migrations/               # SQL migrations
├── types/                        # TypeScript types
│   └── next-auth.d.ts            # NextAuth type extensions
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Route protection middleware
└── .env.local                    # Environment variables (not in git)
```

## Authentication Flows

### 1. User Registration
- Navigate to `/signup`
- Fill in name, email, and password
- Password is hashed with bcryptjs
- User created in Supabase
- Auto-login after registration

### 2. User Login
- Navigate to `/login`
- Enter email and password OR
- Click "Sign in with Google"
- Redirect to dashboard on success

### 3. Password Reset
- Click "Forgot password?" on login
- Enter email address
- Receive reset token (email integration ready)
- Set new password
- Login with new credentials

### 4. Protected Routes
- Middleware automatically protects routes
- Unauthenticated users redirected to login
- Callback URL preserves intended destination

## Documentation

- **PROCESS.md** - Development progress tracker

## Testing

Test the following features:
- User registration and login
- Email verification flow
- Password reset flow
- Protected routes
- Session management
- Error handling
- Security checks

## Security Features

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT sessions with httpOnly cookies
- Row Level Security (RLS) on Supabase
- CSRF protection
- Secure session management
- Environment variables for sensitive data

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Compatible with any Node.js hosting platform:
- Netlify
- Railway
- Render
- AWS
- Digital Ocean

## Environment Variables

Required for production:
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Random secret key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Review the codebase and documentation
- Check environment variables are properly configured

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ using Next.js, NextAuth, and Supabase**

**Version:** 1.0.0  
**Last Updated:** December 22, 2025
