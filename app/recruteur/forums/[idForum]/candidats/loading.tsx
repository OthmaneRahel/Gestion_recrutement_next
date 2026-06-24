export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4"
          style={{ 
            borderColor: '#B329D3',
            borderTopColor: 'transparent'
          }}
        />
        <div className="text-xl text-gray-700 font-semibold">
          Chargement des candidats...
        </div>
      </div>
    </div>
  );
}