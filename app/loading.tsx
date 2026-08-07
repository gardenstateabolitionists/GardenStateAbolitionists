export default function HomeLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="bg-[#1a1a1a] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
          <div className="h-12 bg-gray-700 rounded w-64 mx-auto mb-6" />
          <div className="h-4 bg-gray-700 rounded w-96 mx-auto mb-4" />
          <div className="h-4 bg-gray-700 rounded w-80 mx-auto" />
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6">
                <div className="h-40 bg-gray-200 rounded mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
