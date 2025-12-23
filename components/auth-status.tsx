"use client";

import { useSession } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-gray-600">
          Checking...
        </span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-green-700">
          Authenticated
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-full">
      <div className="w-2 h-2 bg-red-500 rounded-full" />
      <span className="text-xs font-medium text-red-700">
        Not Authenticated
      </span>
    </div>
  );
}
