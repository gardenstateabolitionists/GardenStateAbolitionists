'use client';

import { useState } from 'react';

/**
 * Member portrait that removes itself entirely if the image fails to load.
 *
 * A plain <img> that 404s still renders its box, so the styled circle stayed on
 * the page as an empty grey bubble next to the member's name. That is how this
 * looked for most of the roster: Open States' photo URLs point at a path the
 * Legislature retired, and 66 of 71 were dead. The URLs are now taken from the
 * Legislature's own roster and checked at build time, but they are still
 * someone else's files on someone else's host, so this guards the case where
 * one disappears between refreshes — no bubble is better than an empty one.
 *
 * Not a next/image: these are remote files on a host that is not in
 * next.config remotePatterns, and adding it would put the optimizer in the path
 * of a URL we do not control.
 */
export default function LegislatorPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={112}
      height={112}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-28 h-28 rounded-full object-cover border-2 border-green-700 bg-gray-800 shrink-0"
    />
  );
}
