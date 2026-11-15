export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const base = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '');

  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /account',
    'Disallow: /admin',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /api/',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');
});
