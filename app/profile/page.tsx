import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Navbar } from "@/components/navbar";
import { ProfileActions } from "@/components/profile-actions";

export default async function ProfilePage() {
  const session = await auth();

  // This check is redundant since middleware handles it,
  // but it's good practice for server-side validation
  if (!session?.user) {
    redirect("/login");
  }

  // Get full user data from database
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar showAuthStatus />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Profile Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <span className="text-4xl text-blue-600 font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{session.user.name}</h1>
                <p className="text-blue-100 mt-1">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm break-all">
                  {session.user.id}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900">{session.user.email}</p>
              </div>

              {/* Full Name */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <p className="text-gray-900">
                  {session.user.name || "Not set"}
                </p>
              </div>

              {/* Account Created */}
              {user?.created_at && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Protected Route Badge */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Protected Route
                  </h3>
                  <p className="text-sm text-green-700">
                    This page is automatically protected by middleware. Only
                    authenticated users can access it. Try logging out and
                    visiting this page - you'll be redirected to login!
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <ProfileActions currentName={session.user.name || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
