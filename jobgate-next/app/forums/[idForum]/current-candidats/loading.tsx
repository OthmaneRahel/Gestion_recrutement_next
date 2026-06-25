export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
        <p className="mt-4 text-gray-600 font-medium">Chargement des candidats...</p>
      </div>
    </div>
  );
}