export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const GITHUB_URL =
    'https://github.com/ncdreamer/vosuba-landing/releases/download/v1.0.0/Vosuba-1.0.0-macOS.dmg';

  // Fetch from GitHub (follows redirects automatically)
  const upstream = await fetch(GITHUB_URL);

  if (!upstream.ok) {
    return new Response('Download temporarily unavailable. Please try again.', {
      status: 502,
    });
  }

  // Stream the body back to the client with correct headers
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-apple-diskimage',
      'Content-Disposition': 'attachment; filename="Vosuba-1.0.0-macOS.dmg"',
      'Content-Length': upstream.headers.get('content-length') || '',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
