import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h1 className="text-7xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Forum non trouvé
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Le forum que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          href="/recruteur"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-medium transition"
        >
          Retour aux forums
        </Link>
      </div>
    </div>
  );
}