"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedPageProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProtectedPage({
  children,
  loadingComponent,
}: ProtectedPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
