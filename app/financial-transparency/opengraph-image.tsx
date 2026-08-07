import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';
export const runtime = 'nodejs';

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  // Subtitle deliberately avoids a tax-status claim: OG images are shared
  // into social feeds where they read as an assertion by the organization,
  // and this one cannot be gated on orgInfo the way page copy is.
  return await generateOGImage('FINANCIAL TRANSPARENCY', 'Our Legal Status & Disclosures');
}
