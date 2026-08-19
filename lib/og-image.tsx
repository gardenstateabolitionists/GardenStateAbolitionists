import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export async function generateOGImage(title: string, subtitle?: string) {
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '60px 80px',
            gap: '24px',
          }}
        >
          {/* Logo — satori renders raw <img>; next/image doesn't apply here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoBase64}
            width={96}
            height={96}
            alt=""
          />

          {/* Page title */}
          <div
            style={{
              color: 'white',
              fontSize: title.length > 30 ? 48 : 60,
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                color: '#d1d5db',
                fontSize: 24,
                textAlign: 'center',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
          )}

          <div
            style={{
              width: '60px',
              height: '3px',
              background: '#15803d',
              marginTop: '4px',
            }}
          />
        </div>

        {/* Bottom bar */}
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
    ogSize,
  );
}
