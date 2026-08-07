'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GalleryImageProps {
  src: string;
  alt: string;
}

export default function GalleryImage({ src, alt }: GalleryImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : null}
      {/* Placeholder content when image doesn't load or is loading */}
      <div className={`absolute inset-0 flex items-center justify-center text-gray-400 ${!imageError ? 'opacity-0' : 'opacity-100'}`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}
