'use client';

import { useState, useEffect } from 'react';
import { getPublicSignatureCount } from '@/lib/actions/petition-actions';

export default function SignatureCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getPublicSignatureCount().then(setCount).catch(() => {});
  }, []);

  if (count === null || count === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 mx-auto w-fit mt-8">
      <span className="text-3xl md:text-4xl font-bold text-red-500">
        {count.toLocaleString()}
      </span>
      <span className="text-gray-300 text-sm md:text-base">
        {count === 1 ? 'person has' : 'people have'} signed
      </span>
    </div>
  );
}
