import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0e0e1e 0%, #080814 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Deep purple glow background */}
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
          }}
        />
        {/* New D-Play logo */}
        <svg 
          viewBox="0 0 100 100" 
          style={{
            width: '290px',
            height: '290px',
            display: 'flex',
          }}
        >
          <path
            d="M 28,20 L 52,20 C 68,20 80,32 80,50 C 80,68 68,80 52,80 L 28,80 Z M 43,38 L 43,62 L 63,50 Z"
            fill="#ffffff"
            fillRule="evenodd"
          />
        </svg>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
