// app/settings/desactivation-account/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Page non trouvée
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          La page de désactivation n'existe pas.
        </p>
        <Link
          href="/settings"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-sm font-medium transition"
        >
          Retour aux paramètres
        </Link>
      </div>
    </div>
  );
}