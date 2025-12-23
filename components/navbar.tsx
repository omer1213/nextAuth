"use client";

import Link from "next/link";
import { UserMenu } from "./user-menu";
import { AuthStatus } from "./auth-status";

interface NavbarProps {
  showAuthStatus?: boolean;
}

export function Navbar({ showAuthStatus = false }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Auth System
              </span>
            </Link>

            {/* Auth Status Badge (optional) */}
            {showAuthStatus && (
              <div className="hidden md:block">
                <AuthStatus />
              </div>
            )}
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
