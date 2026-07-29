"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth";
import { ROUTES } from "@/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { initializeAuth } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth from localStorage
    initializeAuth();
    setInitialized(true);
  }, [initializeAuth]);

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router, initialized]);

  if (!initialized || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-secondary-text">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
