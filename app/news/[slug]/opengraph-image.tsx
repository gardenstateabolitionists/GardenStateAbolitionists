import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';
import { getNewsArticleBySlug } from '@/lib/data/news-store';

export const runtime = 'nodejs';
export const alt = 'Garden State Abolitionists';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  const title = article?.title || 'News Article';
  const date = article?.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const logoData = await readFile(join(process.cwd(), 'public/images/gsa-logo.png'));
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top red accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: '#15803d',
            display: 'flex',
          }}
        />

        {/* Top: Logo + Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* satori renders raw <img>; next/image doesn't apply here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            width={44}
            height={44}
            alt=""
          />
          <span
            style={{
              color: '#9ca3af',
              fontSize: '22px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Garden State Abolitionists
          </span>
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: title.length > 60 ? '42px' : '54px',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: Date + NEWS label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#9ca3af', fontSize: '20px' }}>{date}</span>
          <span
            style={{
              color: '#15803d',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            NEWS
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
