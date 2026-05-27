export default function manifest() {
  return {
    name: 'DIIC ZONE',
    short_name: 'DIIC ZONE',
    description: 'Plataforma de Producción Creativa',
    start_url: '/',
    display: 'standalone',
    background_color: '#080814',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon-192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
