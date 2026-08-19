import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Garden State Abolitionists — Equal Protection for the Preborn';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle diagonal accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            background: 'linear-gradient(135deg, transparent 0%, rgba(220,38,38,0.08) 100%)',
            display: 'flex',
          }}
        />

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

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding: '60px 80px',
            gap: '60px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {/* satori renders raw <img>; next/image doesn't apply here */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoBase64}
              width={200}
              height={200}
              alt=""
            />
          </div>

          {/* Text content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              GARDEN
            </div>
            <div
              style={{
                color: 'white',
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              STATE
            </div>
            <div
              style={{
                color: '#15803d',
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              ABOLITIONISTS
            </div>

            <div
              style={{
                width: '60px',
                height: '3px',
                background: '#15803d',
                marginTop: '8px',
              }}
            />

            <div
              style={{
                color: '#9ca3af',
                fontSize: '20px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Equal Protection for the Preborn
            </div>
          </div>
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '48px',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              color: '#6b7280',
              fontSize: '16px',
              letterSpacing: '0.15em',
            }}
          >
            gardenstateabolitionists.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
