"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDashboardPath, validateSession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const redirectFromRoot = async () => {
      const session = await validateSession();

      if (!isActive) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      router.replace(getDashboardPath(session.userType));
    };

    redirectFromRoot();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
      Chargement...
    </main>
  );
}
