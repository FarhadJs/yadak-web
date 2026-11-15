const apiInternal = process.env.API_INTERNAL_URL || 'http://localhost:4000';
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title: 'یدک سیستم | فروشگاه قطعات و لوازم یدکی MVM — نمایندگی MVM فلاحی در یزد',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'فروشگاه تخصصی لوازم یدکی MVM در یزد؛ خرید آنلاین قطعات اصلی 315، 530، 550، X22، X33 و X55 با ضمانت اصالت و ارسال سریع.',
        },
        { name: 'theme-color', content: '#07090c' },
        { property: 'og:locale', content: 'fa_IR' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'یدک سیستم' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    apiInternal,
    public: {
      siteUrl,
    },
  },

  routeRules: {
    // مرورگر و SSR هر دو از دامنه خود سایت به API داخلی پروکسی می‌شوند
    '/api/**': { proxy: `${apiInternal}/api/**` },
    '/': { prerender: false },
  },

  nitro: {
    compressPublicAssets: true,
  },
});
