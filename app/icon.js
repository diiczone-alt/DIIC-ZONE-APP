import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0e0e1e 0%, #080814 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          style={{
            width: '32px',
            height: '32px',
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
      ...size,
    }
  );
}
