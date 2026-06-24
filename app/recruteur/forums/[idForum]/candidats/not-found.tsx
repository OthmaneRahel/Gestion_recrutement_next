'use client';

import Link from 'next/link';

export default function CandidatesNotFound() {
  // ✅ Ce composant s'affiche quand on appelle notFound()
  // dans page.tsx ou dans une route

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Candidats non trouvés
        </h2>
        <p className="text-gray-500 mb-6">
          Aucun candidat trouvé pour ce forum
        </p>
        <Link
          href="/settings"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retour aux paramètres
        </Link>
      </div>
    </div>
  );
}