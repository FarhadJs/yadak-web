type SeoFallback = { title: string; description: string };

/**
 * متادیتای صفحه را از تنظیمات سئوی داشبورد می‌خواند (قابل ویرایش توسط متخصص سئو)
 * و در صورت نبود مقدار، از متن پیش‌فرض استفاده می‌کند.
 */
export const usePageSeo = (
  key: string,
  fallback: SeoFallback,
  vars: Record<string, string> = {},
) => {
  const route = useRoute();
  const config = useRuntimeConfig();

  const { api } = useApi();

  const { data } = useAsyncData('seo:pages', () => api<any[]>('/api/seo'), {
    default: () => [],
    lazy: false,
  });

  const page = computed(() => (data.value || []).find((p: any) => p.key === key));

  const fill = (raw?: string | null) => {
    let value = raw || '';
    for (const [k, v] of Object.entries(vars)) {
      value = value.split(`{${k}}`).join(v);
    }
    return value.trim();
  };

  const title = computed(() => fill(page.value?.title) || fallback.title);
  const description = computed(() => fill(page.value?.description) || fallback.description);
  const robots = computed(() => page.value?.robots || 'index,follow');
  const ogImage = computed(() => page.value?.ogImage || '/og-default.svg');
  const canonical = computed(() => {
    if (page.value?.canonical) return page.value.canonical;
    return `${config.public.siteUrl}${route.path}`;
  });

  useSeoMeta({
    title,
    description,
    robots,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: 'website',
    ogLocale: 'fa_IR',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
  });

  useHead({
    link: [{ rel: 'canonical', href: canonical.value }],
  });

  return { page, title, description, robots, canonical };
};
