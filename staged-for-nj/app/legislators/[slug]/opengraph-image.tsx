import { notFound } from 'next/navigation';
import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';
import {
  chamberLabel,
  getAllSlugs,
  getLegislatorBySlug,
  partyLabel,
} from '@/lib/data/legislators';

export const runtime = 'nodejs';

export const size = ogSize;
export const contentType = ogContentType;

// Pre-render one OG image per legislator at build time.
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legislator = getLegislatorBySlug(slug);
  if (!legislator) notFound();

  const subtitle = `${partyLabel(legislator.party)} · ${chamberLabel(legislator.chamber)} · District ${legislator.district}`;

  return await generateOGImage(legislator.name.toUpperCase(), subtitle);
}
