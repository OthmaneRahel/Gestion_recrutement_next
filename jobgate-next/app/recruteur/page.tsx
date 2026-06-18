"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, AuthSession, clearSession, validateSession } from "@/lib/auth";

type Forum = {
  id: number;
  nom: string;
  entreprise?: string;
  date_forum: string;
  lieu: string;
  description: string;
  nombre_max: number;
  currentNumber: number;
};

export default function RecruteurPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
  const [loadingForums, setLoadingForums] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const guardRecruiterPage = async () => {
      const verifiedSession = await validateSession();

      if (!isActive) return;

      if (!verifiedSession) {
        router.replace("/login");
        return;
      }

      if (verifiedSession.userType !== "recruteur") {
        router.replace("/user");
        return;
      }

      setSession(verifiedSession);
    };

    guardRecruiterPage();

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    if (!session) return;

    const fetchForums = async () => {
      setLoadingForums(true);
      setError("");

      try {
        const response = await axios.get<Forum[]>(`${API_BASE_URL}/forums/`, {
          headers: {
            Authorization: `Bearer ${session.access}`,
          },
        });

        setForums(response.data);
      } catch {
        setError("Impossible de charger vos forums.");
      } finally {
        setLoadingForums(false);
      }
    };

    fetchForums();
  }, [session]);

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm text-gray-500">Espace recruteur</p>
            <h1 className="text-lg font-semibold text-gray-900">
              {session.user.first_name} {session.user.last_name}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Se deconnecter
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenue, {session.user.first_name}
          </h2>
          <p className="mt-2 text-gray-600">
            {session.user.entreprise
              ? `Forums associes a ${session.user.entreprise}`
              : "Vos forums recruteur"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loadingForums ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
            Chargement des forums...
          </div>
        ) : forums.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
            Aucun forum trouve pour ce recruteur.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {forums.map((forum) => (
              <article
                key={forum.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{forum.nom}</h3>
                  <p className="mt-1 text-sm text-gray-500">{forum.date_forum}</p>
                </div>
                <p className="text-sm font-medium text-gray-700">{forum.lieu}</p>
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                  {forum.description}
                </p>
                <div className="mt-5 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700">
                  {forum.currentNumber}/{forum.nombre_max} inscrits
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
