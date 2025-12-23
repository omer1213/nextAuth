import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showAuthStatus />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {session.user.name || "User"}! 🎉
            </h1>
            <p className="mt-2 text-gray-600">
              You're successfully authenticated
            </p>
          </div>

          {/* User Info */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-lg text-gray-900">
                  {session.user.name || "Not set"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900">
                  {session.user.email}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">User ID</p>
                <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                  {session.user.id}
                </p>
              </div>
              {session.user.image && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Avatar</p>
                  <img
                    src={session.user.image}
                    alt="User avatar"
                    className="mt-2 w-16 h-16 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Authentication System Working!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    ✅ Phase 1-4 Complete! You've successfully implemented:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>NextAuth.js with Credentials & Google OAuth</li>
                    <li>Supabase database integration</li>
                    <li>Login, Signup, and Password Reset pages</li>
                    <li>Session management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
