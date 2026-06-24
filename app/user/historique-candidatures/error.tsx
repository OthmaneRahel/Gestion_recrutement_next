// app/settings/historique-candidatures/error.tsx
'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Erreur historique:', error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center py-12">
        <div className="text-red-500 text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Erreur lors du chargement
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {error.message || 'Impossible de charger l\'historique des candidatures'}
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}