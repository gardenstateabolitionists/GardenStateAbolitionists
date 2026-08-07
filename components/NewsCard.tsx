'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image?: string;
  readingTime?: string;
}

export default function NewsCard({ title, excerpt, date, slug, image, readingTime }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = image && image.length > 0 && !imageError;

  return (
    <Link href={`/news/${slug}`} className="block news-card">
      {/* Mobile: stacked card layout */}
      <article className="sm:hidden bg-[#1a1a1a] rounded-lg overflow-hidden group">
        {/* Image section */}
        <div className="relative aspect-video bg-[#2a2a2a]">
          {hasValidImage ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>
        {/* Text section */}
        <div className="p-4">
          <p className="text-gray-400 text-xs mb-2">
            {date}{readingTime && <span> &middot; {readingTime}</span>}
          </p>
          <h3 className="text-white text-lg font-bold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{excerpt}</p>
        </div>
      </article>

      {/* Desktop: overlay layout */}
      <article className="hidden sm:block relative h-80 md:h-96 overflow-hidden group bg-[#1a1a1a]">
        {/* Background Image or Placeholder */}
        <div className="absolute inset-0">
          {hasValidImage ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-gray-300 text-sm mb-2">
            {date}{readingTime && <span> &middot; {readingTime}</span>}
          </p>
          <h3 className="text-white text-xl md:text-2xl font-bold mb-3 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-3">{excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
