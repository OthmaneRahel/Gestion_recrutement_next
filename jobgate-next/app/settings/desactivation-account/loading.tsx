// app/settings/desactivation-account/loading.tsx
export default function Loading() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary"></div>
          <p className="mt-3 text-gray-500">Chargement...</p>
        </div>
      </div>
    </div>
  );
}