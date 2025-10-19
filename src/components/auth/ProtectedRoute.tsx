"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/api/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/auth",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, authStatus } = useAuth();
  const { isLoading } = authStatus;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        const roleRedirects: Record<string, string> = {
          admin: "/admin",
          operator: "/operator",
          supporter: "/supporter",
        };
        router.push(roleRedirects[user?.role || ""] || "/");
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, redirectTo]);

  if (
    isLoading ||
    !isAuthenticated ||
    (requiredRole && user?.role !== requiredRole)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
