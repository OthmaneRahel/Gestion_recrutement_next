"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";

// Lit l'utilisateur connecté stocké en localStorage (comme dans l'ancienne app
// React Router). A terme, ça pourrait être remplacé par un vrai contexte
// d'authentification partagé dans tout le projet.
export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  return user;
}