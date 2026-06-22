// hooks/useAuth.ts
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  validateSession,
  clearSession,
  getDashboardPath,
  getStoredSession,
  logout,
} from "@/lib/auth";
import type { UserRole, AuthSession } from "@/lib/auth";

const SESSION_TIMEOUT = 900000; // 15 minutes

export function useAuth(requiredRole?: UserRole) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    logout();
  }, []);

  const startLogoutTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedSession = getStoredSession();

      if (!storedSession) {
        handleLogout();
        return;
      }

      const validSession = await validateSession();

      if (!validSession) {
        handleLogout();
        return;
      }

      if (requiredRole && validSession.userType !== requiredRole) {
        router.push(getDashboardPath(validSession.userType));
        return;
      }

      setSession(validSession);
      setIsLoading(false);
      startLogoutTimer();
    };

    checkAuth();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router, requiredRole, handleLogout, startLogoutTimer]);

  return {
    session,
    user: session?.user ?? null,
    userType: session?.userType ?? null,
    isLoading,
    isAuthenticated: !!session,
    logout: handleLogout,
  };
}