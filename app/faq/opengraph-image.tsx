import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';
export const runtime = 'nodejs';

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return await generateOGImage('FAQ');
}
