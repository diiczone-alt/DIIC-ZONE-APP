import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "DIIC ZONE | Dashboard",
  description: "Plataforma de Producción Creativa",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DIIC ZONE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('ServiceWorker registration successful with scope: ', reg.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
              
              // Capture Google OAuth token and errors synchronously before Next.js router handles it
              try {
                var hash = window.location.hash || window.location.search;
                if (hash && (hash.indexOf('provider_token') !== -1 || hash.indexOf('error') !== -1)) {
                  var cleanHash = hash.replace('#', '?');
                  var urlParams = new URLSearchParams(cleanHash);
                  var token = urlParams.get('provider_token');
                  if (token) {
                    localStorage.setItem('diic_google_token', token);
                    localStorage.removeItem('diic_waiting_oauth');
                    console.log('[TokenCapture] Captured token:', token.substring(0, 10) + '...');
                  }
                  var errorMsg = urlParams.get('error_description') || urlParams.get('error');
                  if (errorMsg) {
                    localStorage.setItem('diic_google_error', errorMsg.replace(/\\+/g, ' '));
                    localStorage.removeItem('diic_waiting_oauth');
                  }
                }
              } catch (e) {
                console.warn('[TokenCapture] Error:', e);
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
