export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="h-12 w-72 bg-gray-700 rounded mx-auto mb-6 animate-pulse" />
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <div className="h-4 w-64 bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
    </>
  );
}
