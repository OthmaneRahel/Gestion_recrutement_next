'use client';

import { useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';


interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4 flex justify-center">
          <FiAlertCircle className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Impossible de charger la liste des candidats"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 text-white rounded-lg transition-all hover:shadow-lg transform hover:scale-105"
          style={{ backgroundColor: "#B329D3" }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}