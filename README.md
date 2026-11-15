# یدک سیستم — فروشگاه آنلاین لوازم یدکی MVM (فرانت‌اند)

فرانت‌اند Nuxt 3 با رندر سمت سرور (SSR)، فارسی و RTL، برای فروشگاه قطعات MVM نمایندگی فلاحی در یزد.

این پروژه **مستقل از بک‌اند** است و روی هاست جداگانه اجرا می‌شود. بک‌اند NestJS در پروژهٔ `yadak-api` قرار دارد و از طریق یک آدرس عمومی (متغیر `NUXT_PUBLIC_API_BASE`) فراخوانی می‌شود.

## امکانات

- صفحه اصلی، فروشگاه با فیلتر و جستجو، صفحه دسته‌بندی و صفحه محصول
- سبد خرید مهمان (کوکی) و کاربر واردشده (سبد سرور) با ادغام پس از ورود
- ورود/ثبت‌نام، پنل کاربری، سفارش‌ها و جزئیات/لغو سفارش، علاقه‌مندی‌ها
- پنل مدیریت: محصولات (با آپلود عکس)، انبار، دسته‌بندی، سفارش‌ها، کاربران، پیام‌ها، شعب
- صفحه مدیریت سئو با پیش‌نمایش گوگل، `sitemap.xml` و `robots.txt` داینامیک
- ریسپانسیو کامل و تصویرسازی SVG جایگزین برای محصولات بدون عکس

## اجرای محلی

```bash
cp .env.example .env      # مقادیر لوکال از قبل تنظیم شده‌اند
npm install
npm run dev               # http://localhost:3000
```

بک‌اند باید روی `http://localhost:4000` در حال اجرا باشد (راهنمای آن در پروژهٔ `yadak-api`).

## متغیرهای محیطی

| متغیر | پیش‌فرض | توضیح |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | `http://localhost:3000` | آدرس عمومی سایت برای canonical، sitemap و Open Graph |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:4000` | آدرس عمومی API؛ بدون `/api` انتهایی |

این دو متغیر در زمان **build** داخل خروجی Nuxt قرار می‌گیرند؛ هنگام استقرار، قبل از `npm run build` مقدار بدهید.

## بیلد و اجرای پروداکشن

```bash
npm ci
npm run build
PORT=3000 node .output/server/index.mjs
```

## استقرار روی Liara (دو هاست جداگانه)

1. یک اپلیکیشن Node با پلتفرم Nuxt (یا Node 20) بسازید.
2. دستور build: `npm ci && npm run build` — دستور اجرا: `node .output/server/index.mjs`.
3. متغیرها را در پنل Liara تنظیم کنید:

```env
NUXT_PUBLIC_SITE_URL=https://yadak-system.liara.app
NUXT_PUBLIC_API_BASE=https://<آدرس-عمومی-بک‌اند>
```

4. در سمت بک‌اند، `CORS_ORIGIN` را روی `https://yadak-system.liara.app` بگذارید تا مرورگر اجازهٔ فراخوانی API و آپلود را داشته باشد.
5. تصاویر محصول از دامنهٔ بک‌اند سرو می‌شوند؛ نیازی به تنظیم جداگانه‌ای در فرانت نیست.

> پیش از استقرار، مقادیر `.env` را در پنل هاست وارد کنید. فایل `.env` در گیت ignore شده و فقط `.env.example` کامیت می‌شود.

## ساختار

```
components/     کامپوننت‌های مشترک (هدر، فوتر، کارت محصول، فرم محصول، PartArt)
composables/    useApi، useAuth، useCart، useWishlist، usePageSeo، useFormat
layouts/        layout فروشگاه و داشبورد
pages/          فروشگاه، حساب کاربری، پنل مدیریت
server/routes/  sitemap.xml داینامیک
public/         دارایی‌های استاتیک
```

## گردش کار گیت

این ریپو با **git flow** مدیریت می‌شود: `main` (انتشار)، `develop` (توسعه)، `feature/*`، `release/*` و `hotfix/*`.

```bash
git flow feature start my-feature
git flow feature finish my-feature
```
