import type { NextConfig } from "next";

function buildCsp(): string {
  const isDev = process.env.NODE_ENV !== 'production'
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
    : "script-src 'self' 'unsafe-inline' blob:"
  const connectSrc = isDev
    ? "connect-src 'self' ws: wss: https://*.supabase.co https://api.openai.com https://*.stripe.com"
    : "connect-src 'self' https://*.supabase.co https://api.openai.com https://*.stripe.com"
  const imgSrc = isDev
    ? "img-src 'self' data: blob:"
    : "img-src 'self' data:"

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    imgSrc,
    connectSrc,
    "worker-src 'self' blob:",
    "frame-src https://*.stripe.com",
    "font-src 'self' data:",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Content-Security-Policy', value: buildCsp() },
    ]
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
