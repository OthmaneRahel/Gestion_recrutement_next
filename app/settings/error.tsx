// app/settings/error.tsx
'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SettingsError({ error, reset }: ErrorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="text-red-500 text-4xl mb-3">⚠️</div>
      <h2 className="text-lg font-semibold text-foreground mb-1">
        Une erreur est survenue
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {error.message || 'Impossible de charger la page'}
      </p>
      <button
        onClick={reset}
        className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition"
      >
        Réessayer
      </button>
    </div>
  );
}