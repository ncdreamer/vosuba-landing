export const config = {
  runtime: 'edge',
  // Allow longer execution for large file proxy
  maxDuration: 300,
};

export default async function handler(request) {
  const GITHUB_URL =
    'https://github.com/ncdreamer/vosuba-landing/releases/download/v1.0.0/Vosuba-1.0.0-macOS.dmg';

  try {
    // Fetch from GitHub (follows redirects automatically)
    const upstream = await fetch(GITHUB_URL, {
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return new Response('Download temporarily unavailable. Please try again later.', {
        status: 502,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Get content length from upstream
    const contentLength = upstream.headers.get('content-length');

    // Build response headers
    const headers = new Headers({
      'Content-Type': 'application/x-apple-diskimage',
      'Content-Disposition': 'attachment; filename="Vosuba-1.0.0-macOS.dmg"',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Stream the response body directly — no buffering
    return new Response(upstream.body, {
      status: 200,
      headers: headers,
    });
  } catch (err) {
    return new Response('Download error: ' + err.message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
