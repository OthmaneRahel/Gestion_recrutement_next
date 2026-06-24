// app/settings/update-password/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <div className="text-gray-400 text-4xl mb-3">🔍</div>
      <h1 className="text-2xl font-bold text-foreground">404</h1>
      <p className="text-sm text-gray-500 mb-4">Page non trouvée</p>
      <Link
        href="/settings"
        className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium transition"
      >
        Retour
      </Link>
    </div>
  );
}