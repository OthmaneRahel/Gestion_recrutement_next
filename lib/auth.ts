"use client";

import axios from "axios";

export type UserRole = "talent" | "recruteur";

export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  entreprise?: string;
};

export type AuthSession = {
  access: string;
  refresh?: string;
  userType: UserRole;
  user: AuthUser;
};

const ACCESS_TOKEN_KEY = "token-login";
const REFRESH_TOKEN_KEY = "refresh-token";
const USER_KEY = "user";
const USER_TYPE_KEY = "user-type";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

export function getDashboardPath(role: UserRole) {
  return role === "talent" ? "/user" : "/recruteur";
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
}

export function saveSession(payload: {
  access: string;
  refresh?: string;
  user_type: UserRole;
  user: AuthUser;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, payload.access);
  if (payload.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  localStorage.setItem(USER_TYPE_KEY, payload.user_type);
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  const userType = localStorage.getItem(USER_TYPE_KEY) as UserRole | null;
  const storedUser = localStorage.getItem(USER_KEY);

  if (!access || !userType || !storedUser) {
    clearSession();
    return null;
  }

  if (userType !== "talent" && userType !== "recruteur") {
    clearSession();
    return null;
  }

  try {
    return {
      access,
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY) || undefined,
      userType,
      user: JSON.parse(storedUser),
    };
  } catch {
    clearSession();
    return null;
  }
}

export async function validateSession(): Promise<AuthSession | null> {
  const session = getStoredSession();

  if (!session) return null;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/userconn/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.access}`,
        },
      }
    );

    const role = response.data.role as UserRole;
    if (role !== "talent" && role !== "recruteur") {
      clearSession();
      return null;
    }

    const verifiedSession: AuthSession = {
      ...session,
      userType: role,
      user: response.data,
    };

    saveSession({
      access: verifiedSession.access,
      refresh: verifiedSession.refresh,
      user_type: verifiedSession.userType,
      user: verifiedSession.user,
    });

    return verifiedSession;
  } catch {
    clearSession();
    return null;
  }
}

export function logout() {
  clearSession();
  // Redirection côté client
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Pourquoi window.location.href au lieu de router.push() ?
// logout() peut être appelée hors composants React (ex: intercepteur Axios), donc on utilise window.location pour être sûr que la redirection fonctionne partout.