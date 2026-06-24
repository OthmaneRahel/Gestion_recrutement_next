// app/settings/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary"></div>
        <p className="mt-3 text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );
}