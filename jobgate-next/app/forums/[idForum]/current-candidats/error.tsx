'use client';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Erreur:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-red text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Oups ! Une erreur est survenue
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {error.message || 'Impossible de charger les candidats'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-medium transition"
          >
            Réessayer
          </button>
          <a
            href="/recruteur"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition"
          >
            Retour
          </a>
        </div>
      </div>
    </div>
  );
}