import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';
import { getCityBySlug } from '@/lib/data/cities';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  const title = city ? `ABOLISH ABORTION IN ${city.name.toUpperCase()}` : 'CITY NOT FOUND';
  const subtitle = city ? `${city.region} · ${city.populationLabel}` : '';
  return await generateOGImage(title, subtitle);
}
