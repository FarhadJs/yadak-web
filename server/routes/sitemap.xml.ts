export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const base = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '');
  const api = String(config.apiInternal || 'http://localhost:4000').replace(/\/$/, '');

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [p, c] = await Promise.all([
      $fetch<any>(`${api}/api/products`, { query: { limit: 48, page: 1 } }),
      $fetch<any[]>(`${api}/api/categories`),
    ]);
    products = p?.items || [];
    categories = c || [];
  } catch {
    // در صورت قطع ارتباط با API، حداقل صفحات ثابت نقشه سایت تولید می‌شوند
  }

  const today = new Date().toISOString().slice(0, 10);

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/products', priority: '0.9', changefreq: 'daily' },
    { loc: '/branches', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
  ];

  const urls = [
    ...staticPages.map(
      (p) => `<url><loc>${base}${p.loc}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`,
    ),
    ...categories.map(
      (c) => `<url><loc>${base}/category/${c.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ),
    ...products.map(
      (p) => `<url><loc>${base}/products/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    ),
  ];

  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
});
