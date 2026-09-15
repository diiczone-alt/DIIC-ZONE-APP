import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'DIIC ZONE - Plataforma de Producción Creativa';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #090912 0%, #030308 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow circle */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '28px',
            padding: '24px 32px',
            marginBottom: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          <svg 
            viewBox="0 0 100 100" 
            style={{
              width: '70px',
              height: '70px',
              marginRight: '20px',
            }}
          >
            <path
              d="M 28,20 L 52,20 C 68,20 80,32 80,50 C 80,68 68,80 52,80 L 28,80 Z M 43,38 L 43,62 L 63,50 Z"
              fill="#ffffff"
              fillRule="evenodd"
            />
          </svg>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '900',
              letterSpacing: '-1px',
              color: '#ffffff',
              display: 'flex',
            }}
          >
            DIIC<span style={{ color: '#818cf8', marginLeft: '6px' }}>ZONE</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Plataforma de Producción Creativa con Inteligencia Artificial
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
