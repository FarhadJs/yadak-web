<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const slug = String(route.params.slug);

const { api, assetUrl } = useApi();
const { data: product } = await useAsyncData(`product:${slug}`, () =>
  api<any>(`/api/products/${slug}`),
);

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'محصول مورد نظر یافت نشد', fatal: true });
}

const cart = useCart();
const wishlist = useWishlist();
const toast = useToast();

const qty = ref(1);
const adding = ref(false);
const activeTab = ref<'desc' | 'specs' | 'shipping'>('desc');

const { title } = usePageSeo(
  'product',
  {
    title: `${product.value.name} | خرید آنلاین ${product.value.category?.name || 'قطعات'} MVM`,
    description: `${product.value.shortDesc} خرید ${product.value.name} با ضمانت اصالت از یدک سیستم — نمایندگی MVM فلاحی یزد.`,
  },
  {
    name: product.value.name,
    category: product.value.category?.name || 'قطعات MVM',
    shortDesc: product.value.shortDesc || '',
  },
);

const productUrl = computed(() => `${config.public.siteUrl}/products/${product.value?.slug}`);

useSeoMeta({
  ogImage: computed(() =>
    product.value?.image
      ? assetUrl(product.value.image)
      : `${config.public.siteUrl}/og-default.svg`,
  ),
  twitterImage: computed(() =>
    product.value?.image
      ? assetUrl(product.value.image)
      : `${config.public.siteUrl}/og-default.svg`,
  ),
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.value.name,
        sku: product.value.sku,
        image: product.value.image
          ? assetUrl(product.value.image)
          : `${config.public.siteUrl}/og-default.svg`,
        description: product.value.shortDesc,
        brand: { '@type': 'Brand', name: 'MVM' },
        category: product.value.category?.name,
        offers: {
          '@type': 'Offer',
          url: productUrl.value,
          priceCurrency: 'IRR',
          price: product.value.price * 10,
          availability: product.value.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'یدک سیستم' },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.value.rating,
          reviewCount: Math.max(6, product.value.sold),
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: config.public.siteUrl },
          { '@type': 'ListItem', position: 2, name: 'فروشگاه قطعات', item: `${config.public.siteUrl}/products` },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.value.category?.name || 'قطعات',
            item: `${config.public.siteUrl}/category/${product.value.category?.slug || ''}`,
          },
          { '@type': 'ListItem', position: 4, name: product.value.name, item: productUrl.value },
        ],
      }),
    },
  ],
});

watch(
  () => product.value?.stock,
  (stock) => {
    if (stock && qty.value > stock) qty.value = stock;
  },
);

const addToCart = async () => {
  if (!product.value.inStock) return;
  adding.value = true;
  try {
    await cart.add(product.value, qty.value);
    toast.push(`${faNum(qty.value)} عدد «${product.value.name}» به سبد خرید اضافه شد.`);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    adding.value = false;
  }
};

const toggleWish = async () => {
  try {
    await wishlist.toggle(product.value.id);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

const buyNow = async () => {
  await addToCart();
  await navigateTo('/cart');
};
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="container">
      <nav class="crumbs" aria-label="مسیر صفحه">
        <NuxtLink to="/">خانه</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products">فروشگاه قطعات</NuxtLink>
        <span>/</span>
        <NuxtLink :to="`/category/${product.category?.slug}`">{{ product.category?.name }}</NuxtLink>
        <span>/</span>
        <span class="current">{{ product.name }}</span>
      </nav>

      <div class="product-main">
        <div class="gallery">
          <div class="gallery-main tech-grid">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="gallery-img"
              decoding="async"
            />
            <PartArt v-else :kind="product.art" :label="product.name" />
            <span v-if="product.discountPercent" class="gallery-off">
              {{ faNum(product.discountPercent) }}٪ تخفیف
            </span>
            <span class="gallery-sku mono">{{ product.sku }}</span>
          </div>
          <div class="gallery-foot">
            <div class="gallery-note">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                <path d="M9 12l2 2 4-4" stroke-linecap="round" />
              </svg>
              اصل بودن قطعه تضمین می‌شود
            </div>
            <span class="tag">{{ product.unit }} / بسته استاندارد</span>
          </div>
        </div>

        <div class="info">
          <div class="info-cat">
            <NuxtLink :to="`/category/${product.category?.slug}`">{{ product.category?.name }}</NuxtLink>
            <span class="mono">کد فنی: {{ product.sku }}</span>
          </div>

          <h1 class="h1">{{ product.name }}</h1>

          <div class="rating-row">
            <span class="stars" aria-hidden="true">
              <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" width="15" height="15"
                :fill="i <= Math.round(product.rating) ? '#ffb020' : 'none'"
                stroke="#ffb020" stroke-width="1.4">
                <path d="M12 2l3 6.5 7 .9-5 4.8 1.2 7-6.2-3.4L5.8 21 7 14.2 2 9.4l7-.9z" />
              </svg>
            </span>
            <span class="small muted">{{ product.rating }} از ۵</span>
            <span class="dot-sep" />
            <span class="small muted">{{ faNum(product.sold) }} فروش موفق</span>
          </div>

          <p class="short-desc">{{ product.shortDesc }}</p>

          <div class="buybox">
            <div class="buybox-price">
              <div class="price-line">
                <span class="price">{{ toman(product.price) }}</span>
                <span v-if="product.comparePrice" class="price-old">{{ toman(product.comparePrice) }}</span>
              </div>
              <span class="stock-line" :class="product.inStock ? 'in' : 'out'">
                <span class="dot" />
                {{ product.inStock ? `موجود در انبار (${faNum(product.stock)} ${product.unit})` : 'ناموجود — برای اطلاع از موجودی تماس بگیرید' }}
              </span>
            </div>

            <div class="buybox-actions">
              <div class="qty">
                <button type="button" aria-label="کاهش تعداد" :disabled="qty <= 1" @click="qty--">−</button>
                <span>{{ faNum(qty) }}</span>
                <button type="button" aria-label="افزایش تعداد" :disabled="!product.inStock || qty >= product.stock" @click="qty++">+</button>
              </div>
              <button type="button" class="btn btn-primary add-btn" :disabled="adding || !product.inStock" @click="addToCart">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9">
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" stroke-linecap="round" />
                  <circle cx="9.5" cy="20" r="1.4" />
                  <circle cx="18" cy="20" r="1.4" />
                </svg>
                {{ adding ? 'در حال افزودن…' : 'افزودن به سبد خرید' }}
              </button>
              <button type="button" class="btn btn-outline wish-btn" :class="{ active: wishlist.has(product.id) }" @click="toggleWish">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </button>
            </div>

            <button type="button" class="btn btn-dark btn-block" :disabled="!product.inStock" @click="buyNow">
              خرید سریع و تکمیل سفارش
            </button>
          </div>

          <div class="model-list">
            <span class="model-list-title">سازگار با:</span>
            <span v-for="m in product.models" :key="m.id" class="tag mono">{{ m.name }}</span>
            <span v-if="!product.models.length" class="tag">عمومی</span>
          </div>

          <ul class="assurance">
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="18" cy="18" r="1.6" /></svg>
              ارسال ۲۴ ساعته در یزد و تهران
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /></svg>
              ضمانت اصالت و بازگشت ۷ روزه
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v11H8l-4 4z" /></svg>
              مشاوره نصب با کارشناس فنی
            </li>
          </ul>
        </div>
      </div>

      <div class="tabs panel">
        <div class="tab-head" role="tablist">
          <button type="button" role="tab" :aria-selected="activeTab === 'desc'" :class="{ active: activeTab === 'desc' }" @click="activeTab = 'desc'">توضیحات</button>
          <button type="button" role="tab" :aria-selected="activeTab === 'specs'" :class="{ active: activeTab === 'specs' }" @click="activeTab = 'specs'">مشخصات فنی</button>
          <button type="button" role="tab" :aria-selected="activeTab === 'shipping'" :class="{ active: activeTab === 'shipping' }" @click="activeTab = 'shipping'">ارسال و گارانتی</button>
        </div>

        <div class="tab-body">
          <div v-if="activeTab === 'desc'" class="tab-desc">
            <p>{{ product.description }}</p>
            <p class="muted small">
              توجه: تصویر نمایش‌داده‌شده نمادین است. برای اطمینان از تطابق قطعه با خودرو،
              کد فنی {{ product.sku }} را با کارشناس ما تأیید کنید.
            </p>
          </div>

          <table v-else-if="activeTab === 'specs'" class="specs-table">
            <tbody>
              <tr v-for="spec in product.specs" :key="spec[0]">
                <th>{{ spec[0] }}</th>
                <td>{{ spec[1] }}</td>
              </tr>
              <tr>
                <th>کد فنی (SKU)</th>
                <td class="mono">{{ product.sku }}</td>
              </tr>
            </tbody>
          </table>

          <div v-else class="tab-desc">
            <p>
              ارسال سفارش‌های ثبت‌شده تا ساعت ۱۴ در همان روز کاری انجام می‌شود. برای یزد و تهران
              معمولاً ۲۴ ساعته و برای سایر استان‌ها ۲ تا ۴ روز کاری است.
            </p>
            <p class="muted small">
              گارانتی اصالت کالا ۷ روز از زمان تحویل، در صورت وجود مغایرت یا ایراد فنی، با
              هماهنگی پشتیبانی انجام می‌شود. هزینه ارسال برای سفارش‌های بالای ۵ میلیون تومان رایگان است.
            </p>
          </div>
        </div>
      </div>

      <section v-if="product.related?.length" class="related">
        <div class="section-head">
          <div>
            <span class="eyebrow">مکمل قطعه</span>
            <h2 class="h2">قطعات مرتبط</h2>
          </div>
        </div>
        <div class="product-grid">
          <ProductCard v-for="p in product.related" :key="p.id" :product="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  padding-block: 22px 50px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.crumbs a:hover {
  color: #fff;
}

.crumbs .current {
  color: #d7e0e9;
}

.product-main {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 32px;
  align-items: start;
}

.gallery-main {
  position: relative;
  aspect-ratio: 1 / 0.86;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    radial-gradient(60% 60% at 50% 45%, rgba(255, 59, 47, 0.12), transparent 70%),
    #0a0e13;
  padding: 34px;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
}

.gallery-off {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--accent);
  color: #fff;
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 7px;
}

.gallery-sku {
  position: absolute;
  bottom: 14px;
  left: 16px;
  font-size: 10.5px;
  color: var(--muted-2);
  letter-spacing: 0.06em;
}

.gallery-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.gallery-note {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: #6fdc9f;
}

.info {
  display: grid;
  gap: 14px;
}

.info-cat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 11.5px;
}

.info-cat a {
  color: var(--accent);
  font-weight: 600;
}

.info-cat .mono {
  color: var(--muted-2);
  font-size: 10.5px;
}

.h1 {
  font-size: clamp(22px, 2.8vw, 31px);
  font-weight: 900;
  line-height: 1.45;
  letter-spacing: -0.01em;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.dot-sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--muted-2);
}

.short-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 2;
}

.buybox {
  display: grid;
  gap: 13px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--panel);
}

.buybox-price {
  display: grid;
  gap: 5px;
}

.price-line {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.price-line .price {
  font-size: 24px;
}

.stock-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
}

.stock-line .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.stock-line.in { color: #4bc98c; }
.stock-line.out { color: #ff8d9b; }

.buybox-actions {
  display: flex;
  gap: 8px;
}

.qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 9px;
  overflow: hidden;
  background: #0b0f14;
}

.qty button {
  width: 36px;
  height: 46px;
  border: none;
  background: transparent;
  color: #d5dfe9;
  font-size: 17px;
  cursor: pointer;
}

.qty button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.qty button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.qty span {
  min-width: 32px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.add-btn {
  flex: 1;
}

.wish-btn {
  width: 48px;
  padding: 0;
  flex-shrink: 0;
  color: var(--muted);
}

.wish-btn.active {
  color: #ff5468;
  border-color: rgba(255, 84, 104, 0.5);
  background: rgba(255, 84, 104, 0.1);
}

.model-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.model-list-title {
  font-size: 11.5px;
  color: var(--muted-2);
}

.assurance {
  display: grid;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
}

.assurance li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--muted);
}

.assurance svg {
  color: var(--accent);
  flex-shrink: 0;
}

.tabs {
  margin-top: 34px;
  overflow: hidden;
}

.tab-head {
  display: flex;
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
}

.tab-head button {
  padding: 14px 22px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.tab-head button.active {
  color: #fff;
  border-bottom-color: var(--accent);
  background: rgba(255, 59, 47, 0.04);
}

.tab-body {
  padding: 22px;
}

.tab-desc {
  display: grid;
  gap: 12px;
}

.tab-desc p {
  font-size: 13.5px;
  line-height: 2.1;
  color: #c8d2dd;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.specs-table th,
.specs-table td {
  text-align: right;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line-soft);
}

.specs-table th {
  width: 200px;
  color: var(--muted);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.015);
}

.related {
  margin-top: 44px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 980px) {
  .product-main { grid-template-columns: 1fr; gap: 22px; }
  .gallery-main { aspect-ratio: 1 / 0.75; padding: 24px; }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 520px) {
  .buybox-actions { flex-wrap: wrap; }
  .qty { flex: 1; }
  .add-btn { flex-basis: 100%; order: 3; }
  .tab-body { padding: 16px; }
  .product-grid { grid-template-columns: 1fr; }
}
</style>
