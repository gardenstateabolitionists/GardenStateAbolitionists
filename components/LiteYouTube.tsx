'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Click-to-load YouTube facade. Renders a static thumbnail with a play button;
 * only mounts the iframe (which is what triggers cookies + massive JS) after
 * the user clicks Play.
 *
 * This closes Lighthouse's third-party-cookie best-practice warning for pages
 * that embed YouTube, and shaves ~600 KB of transferred JS off the initial load.
 */
export default function LiteYouTube({ videoId, title, className = '' }: LiteYouTubeProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className={`aspect-video ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={`relative aspect-video w-full overflow-hidden rounded-lg group cursor-pointer bg-black ${className}`}
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        unoptimized
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
        <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
          <svg
            className="w-8 h-8 md:w-10 md:h-10 text-white translate-x-0.5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
