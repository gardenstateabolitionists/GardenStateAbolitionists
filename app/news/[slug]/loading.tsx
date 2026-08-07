const widths = [90, 100, 75, 95, 85, 100, 80, 88];

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="h-4 w-40 bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-10 w-3/4 bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {widths.map((w, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
