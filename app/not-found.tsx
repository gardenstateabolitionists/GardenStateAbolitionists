import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-6xl md:text-8xl font-bold text-red-600 mb-4">404</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-500 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="bg-white py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-8">Here are some helpful links to get you back on track:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">Home</p>
            </Link>
            <Link
              href="/the-petition"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">Sign the Petition</p>
            </Link>
            <Link
              href="/news"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">News</p>
            </Link>
            <Link
              href="/who-we-are"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">Who We Are</p>
            </Link>
            <Link
              href="/contact"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">Contact</p>
            </Link>
            <Link
              href="/donate"
              className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
            >
              <p className="font-semibold text-[#1a1a1a]">Donate</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
