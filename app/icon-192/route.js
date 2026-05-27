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
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(10px)',
          }}
        />
        {/* Monogram DZ */}
        <div
          style={{
            display: 'flex',
            fontSize: '85px',
            fontWeight: '900',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: '#ffffff',
            letterSpacing: '-0.06em',
            textShadow: '0 0 35px rgba(99, 102, 241, 0.7)',
            fontStyle: 'italic',
          }}
        >
          DZ
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
