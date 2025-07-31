"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "teacher";
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requiredRole,
  redirectTo = "/",
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();

      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole) {
        const hasRequiredRole = authService.hasRole(requiredRole);
        if (!hasRequiredRole) {
          router.push(redirectTo);
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
