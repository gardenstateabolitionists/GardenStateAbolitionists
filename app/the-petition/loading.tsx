export default function PetitionLoading() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">The</span>{' '}
            <span className="font-black">PETITION</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Call for the abolition of abortion in New Jersey</p>
        </div>
      </section>

      {/* Skeleton Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Petition text skeleton */}
          <div className="bg-gray-50 p-8 rounded-lg mb-12 animate-pulse">
            <div className="h-7 bg-gray-200 rounded w-64 mx-auto mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>

          {/* Form skeleton */}
          <div className="bg-red-50 border-2 border-red-600 p-8 rounded-lg animate-pulse">
            <div className="h-7 bg-red-200 rounded w-48 mx-auto mb-6" />
            <div className="h-4 bg-red-100 rounded w-32 mx-auto mb-4" />
            <div className="h-4 bg-red-100 rounded w-80 mx-auto mb-6" />
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="h-10 bg-white rounded border border-gray-300" />
              <div className="h-10 bg-white rounded border border-gray-300" />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="h-10 bg-white rounded border border-gray-300" />
              <div className="h-10 bg-white rounded border border-gray-300" />
              <div className="h-10 bg-white rounded border border-gray-300" />
            </div>
            <div className="h-12 bg-white rounded border border-gray-200 mb-4" />
            <div className="h-14 bg-red-300 rounded w-56 mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
