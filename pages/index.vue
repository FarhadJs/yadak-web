<script setup lang="ts">
const config = useRuntimeConfig();

const { data: home } = await useAsyncData('home', () => $fetch<any>('/api/home'));
const { data: branches } = await useAsyncData('branches', () => $fetch<any[]>('/api/branches'), {
  default: () => [],
});

usePageSeo('home', {
  title: 'یدک سیستم | فروشگاه قطعات و لوازم یدکی MVM — نمایندگی MVM فلاحی در یزد',
  description:
    'فروشگاه تخصصی لوازم یدکی MVM در یزد؛ خرید آنلاین قطعات اصلی 315، 530، 550، X22، X33 و X55 با ضمانت اصالت، ارسال سریع و مشاوره فنی رایگان.',
});

const categoryArt: Record<string, string> = {
  engine: 'engine',
  brake: 'disc',
  filters: 'filter',
  electrical: 'battery',
  suspension: 'shock',
  cooling: 'radiator',
  body: 'mirror',
  fluids: 'fluid',
};

const promo = computed(
  () => (home.value?.featured || []).find((p: any) => p.discountPercent > 0) || home.value?.featured?.[0],
);

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AutoPartsStore',
            name: 'یدک سیستم — نمایندگی MVM فلاحی، لوازم یدکی MVM یزد',
            url: config.public.siteUrl,
            telephone: '+983538226600',
            priceRange: '$$',
            image: `${config.public.siteUrl}/og-default.svg`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'بلوار جمهوری اسلامی، جنب پل بازار نو، پلاک ۴۱۲',
              addressLocality: 'یزد',
              addressRegion: 'یزد',
              addressCountry: 'IR',
            },
            openingHours: 'Sa-Th 08:00-20:00',
          },
          {
            '@type': 'WebSite',
            name: 'یدک سیستم',
            url: config.public.siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${config.public.siteUrl}/products?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    },
  ],
});
</script>

<template>
  <div v-if="home">
    <!-- ============================ هیرو ============================ -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy fade-up">
          <span class="eyebrow">نمایندگی رسمی MVM در یزد</span>
          <h1 class="display">
            قطعهٔ اصل،<br />
            برای <span class="accent">MVM</span> تو.
          </h1>
          <p class="hero-desc">
            از لنت ترمز تا کیت کلاچ؛ قطعات اصلی و OEM برای مدل‌های MVM با ضمانت اصالت،
            مشاوره فنی رایگان و ارسال سریع از یزد به سراسر ایران.
          </p>

          <div class="hero-cta">
            <NuxtLink to="/products" class="btn btn-primary btn-lg">
              خرید قطعات
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 6l-6 6 6 6" stroke-linecap="round" />
              </svg>
            </NuxtLink>
            <NuxtLink to="/contact" class="btn btn-outline btn-lg">استعلام قطعه</NuxtLink>
          </div>

          <div class="hero-models">
            <span class="hero-models-label">قطعه مناسب خودروی من:</span>
            <div class="hero-chips">
              <NuxtLink
                v-for="m in home.models.slice(0, 5)"
                :key="m.id"
                :to="`/products?model=${m.slug}`"
                class="hero-chip"
              >
                {{ m.name }}
              </NuxtLink>
            </div>
          </div>

          <dl class="hero-stats">
            <div>
              <dt>{{ faNum(home.stats.products) }}</dt>
              <dd>قطعه فعال در انبار</dd>
            </div>
            <div>
              <dt>{{ faNum(home.stats.models) }}</dt>
              <dd>مدل تحت پوشش MVM</dd>
            </div>
            <div>
              <dt>{{ faNum(18) }}</dt>
              <dd>سال تجربه در یزد</dd>
            </div>
          </dl>
        </div>

        <div class="hero-visual fade-up">
          <div class="hero-stage">
            <div class="hero-glow" />
            <div class="hero-ring" />
            <div class="hero-ring inner" />
            <div class="hero-art">
              <PartArt kind="disc" label="دیسک ترمز MVM" />
            </div>
          </div>
          <div class="hero-tag tag-a">
            <span class="tag-icon ok">✓</span>
            <div>
              <strong>ضمانت اصالت</strong>
              <span>گارانتی نمایندگی</span>
            </div>
          </div>
          <div class="hero-tag tag-b">
            <span class="tag-icon gold">⚡</span>
            <div>
              <strong>ارسال ۲۴ ساعته</strong>
              <span>یزد و تهران</span>
            </div>
          </div>
          <div class="hero-tag tag-c mono">OEM · MVM · 315/530/X55</div>
        </div>
      </div>

      <div class="container hero-brandbar">
        <span>MVM</span>
        <span class="sep" />
        <span>قطعات اصلی</span>
        <span class="sep" />
        <span>ضمانت اصالت</span>
        <span class="sep" />
        <span>مشاوره تخصصی</span>
        <span class="sep" />
        <span>ارسال سراسر کشور</span>
      </div>
    </section>

    <!-- ========================== انتخاب مدل ========================== -->
    <section class="section model-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">انتخاب سریع</span>
            <h2 class="h2">قطعه مناسب خودروی خود را پیدا کنید</h2>
            <p>مدل خودروی خود را انتخاب کنید تا فقط قطعات سازگار را ببینید.</p>
          </div>
          <NuxtLink to="/products" class="btn btn-outline btn-sm">همه قطعات</NuxtLink>
        </div>

        <div class="model-grid">
          <NuxtLink
            v-for="m in home.models"
            :key="m.id"
            :to="`/products?model=${m.slug}`"
            class="model-card"
          >
            <span class="model-code">{{ m.name }}</span>
            <span class="model-years">{{ m.yearRange }}</span>
            <span class="model-count">{{ faNum(m.productCount) }} قطعه</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============================ دسته‌ها ============================ -->
    <section class="section cat-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">دسته‌بندی قطعات</span>
            <h2 class="h2">از موتور تا بدنه، همه‌چیز برای MVM</h2>
          </div>
        </div>

        <div class="cat-grid">
          <NuxtLink
            v-for="cat in home.categories"
            :key="cat.id"
            :to="`/category/${cat.slug}`"
            class="cat-card"
          >
            <span class="cat-art">
              <PartArt :kind="categoryArt[cat.slug] || 'filter'" :label="cat.name" />
            </span>
            <span class="cat-info">
              <strong>{{ cat.name }}</strong>
              <small>{{ faNum(cat.productCount) }} قطعه</small>
            </span>
            <svg class="cat-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 6l-6 6 6 6" stroke-linecap="round" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ========================== پرفروش‌ها ========================== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">پیشنهاد نمایندگی</span>
            <h2 class="h2">پرفروش‌ترین قطعات این هفته</h2>
            <p>انتخاب مشتریان یزدی؛ موجود در انبار و آماده ارسال.</p>
          </div>
          <NuxtLink to="/products" class="btn btn-outline btn-sm">مشاهده فروشگاه ←</NuxtLink>
        </div>

        <div class="product-grid">
          <ProductCard v-for="p in home.featured" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- ========================== بنر تخفیف ========================== -->
    <section v-if="promo" class="section-sm">
      <div class="container">
        <div class="promo">
          <div class="promo-art">
            <PartArt :kind="promo.art" :label="promo.name" />
          </div>
          <div class="promo-copy">
            <span class="badge badge-gold">پیشنهاد ویژه هفته</span>
            <h3>{{ promo.name }}</h3>
            <p>{{ promo.shortDesc }}</p>
            <div class="promo-prices">
              <span class="price">{{ toman(promo.price) }}</span>
              <span v-if="promo.comparePrice" class="price-old">{{ toman(promo.comparePrice) }}</span>
              <span v-if="promo.discountPercent" class="badge badge-ok">
                {{ faNum(promo.discountPercent) }}٪ تخفیف
              </span>
            </div>
          </div>
          <NuxtLink :to="`/products/${promo.slug}`" class="btn btn-primary promo-btn">
            مشاهده و خرید
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============================== چرا ما ============================== -->
    <section class="section why">
      <div class="container">
        <div class="why-grid">
          <div class="why-copy">
            <span class="eyebrow">چرا یدک سیستم</span>
            <h2 class="h2">نمایندگی‌ای که قطعه را می‌شناسد</h2>
            <p class="muted">
              هجده سال تأمین قطعات MVM در استان یزد؛ با انبار فعال، کد فنی دقیق و تیمی که
              می‌تواند با شماره VIN خودرو، قطعه درست را برای شما پیدا کند.
            </p>
            <NuxtLink to="/branches" class="why-link">آدرس و شعب نمایندگی ←</NuxtLink>
          </div>

          <div class="why-cards">
            <div class="why-card">
              <span class="why-num mono">01</span>
              <h4>قطعات اصلی و OEM</h4>
              <p>تأمین از مسیر رسمی با فاکتور و گارانتی؛ بدون قطعه تقلبی.</p>
            </div>
            <div class="why-card">
              <span class="why-num mono">02</span>
              <h4>انبار واقعی در یزد</h4>
              <p>موجودی سایت با انبار هم‌زمان به‌روز می‌شود؛ آنچه می‌بینید موجود است.</p>
            </div>
            <div class="why-card">
              <span class="why-num mono">03</span>
              <h4>مشاوره با کد VIN</h4>
              <p>قطعه مناسب مدل و سال ساخت را با کارشناس ما تأیید کنید.</p>
            </div>
            <div class="why-card">
              <span class="why-num mono">04</span>
              <h4>ارسال سراسری</h4>
              <p>پست پیشتاز و باربری؛ یزد و تهران معمولاً ۲۴ ساعته.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================== جدیدترین‌ها ========================== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">تازه رسیده</span>
            <h2 class="h2">جدیدترین قطعات انبار</h2>
          </div>
        </div>
        <div class="product-grid">
          <ProductCard v-for="p in home.latest.slice(0, 4)" :key="p.id" :product="p" />
        </div>
      </div>
    </section>

    <!-- ============================== شعب ============================== -->
    <section class="section branches-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow">حضوری هم در خدمتیم</span>
            <h2 class="h2">شعب نمایندگی در استان یزد</h2>
          </div>
          <NuxtLink to="/branches" class="btn btn-outline btn-sm">آدرس و نقشه شعب ←</NuxtLink>
        </div>

        <div class="branch-grid">
          <div v-for="b in branches.slice(0, 3)" :key="b.id" class="branch-card">
            <div class="branch-top">
              <span class="branch-city">{{ b.city }}</span>
              <span v-if="b.isMain" class="badge badge-accent">شعبه مرکزی</span>
            </div>
            <h4>{{ b.name }}</h4>
            <p class="branch-address">{{ b.address }}</p>
            <div class="branch-meta">
              <a href="tel:03538226600" class="mono">{{ b.phone }}</a>
              <span>{{ b.hours }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================== CTA ============================== -->
    <section class="section-sm">
      <div class="container">
        <div class="cta">
          <div class="cta-glow" />
          <div>
            <h2 class="h2">قطعه مورد نظر را پیدا نکردید؟</h2>
            <p>
              کد فنی یا شماره VIN خودرو را برای ما بفرستید؛ کارشناسان ما موجودی و قیمت را
              در کمتر از یک ساعت کاری اعلام می‌کنند.
            </p>
          </div>
          <div class="cta-actions">
            <NuxtLink to="/contact" class="btn btn-primary">ارسال درخواست</NuxtLink>
            <a href="tel:03538226600" class="btn btn-outline mono">۰۳۵-۳۸۲۲۶۶۰۰</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ------------------------------- هیرو ------------------------------- */
.hero {
  position: relative;
  padding-top: 52px;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
}

.hero-copy .eyebrow {
  margin-bottom: 18px;
}

.accent {
  color: var(--accent);
  text-shadow: 0 0 40px rgba(255, 59, 47, 0.4);
}

.hero-desc {
  margin-top: 18px;
  max-width: 520px;
  color: var(--muted);
  font-size: 15px;
  line-height: 2;
}

.hero-cta {
  display: flex;
  gap: 12px;
  margin-top: 26px;
  flex-wrap: wrap;
}

.hero-models {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--line-soft);
}

.hero-models-label {
  font-size: 12px;
  color: var(--muted-2);
}

.hero-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.hero-chip {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0c1117;
  font-family: var(--mono);
  font-size: 11.5px;
}

.hero-chip:hover {
  border-color: rgba(255, 59, 47, 0.55);
  background: rgba(255, 59, 47, 0.1);
}

.hero-stats {
  display: flex;
  gap: 30px;
  margin: 28px 0 0;
  padding: 0;
}

.hero-stats dt {
  font-size: 26px;
  font-weight: 900;
  color: #fff;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;
}

.hero-stats dd {
  margin: 0;
  font-size: 11.5px;
  color: var(--muted-2);
}

.hero-visual {
  position: relative;
  display: grid;
  place-items: center;
}

.hero-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}

.hero-glow {
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 59, 47, 0.22), transparent 65%);
  filter: blur(20px);
}

.hero-ring {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  animation: spin 60s linear infinite;
}

.hero-ring.inner {
  inset: 17%;
  border-style: solid;
  border-color: rgba(255, 59, 47, 0.16);
  animation-direction: reverse;
  animation-duration: 40s;
}

.hero-ring::after {
  content: '';
  position: absolute;
  top: -3px;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 16px 3px rgba(255, 59, 47, 0.7);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hero-art {
  position: relative;
  width: 76%;
  height: 76%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.05), transparent 60%);
}

.hero-art :deep(svg) {
  filter: drop-shadow(0 24px 50px rgba(255, 59, 47, 0.28));
}

.hero-tag {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border-radius: 11px;
  background: rgba(12, 17, 23, 0.92);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(8px);
}

.hero-tag strong {
  display: block;
  font-size: 12px;
  line-height: 1.6;
}

.hero-tag span:not(.tag-icon) {
  font-size: 10.5px;
  color: var(--muted-2);
}

.tag-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
}

.tag-icon.ok { background: rgba(47, 208, 125, 0.15); color: #58e2a1; }
.tag-icon.gold { background: rgba(255, 176, 32, 0.15); color: #ffc55c; }

.tag-a { top: 16%; right: -2%; animation: float 6s ease-in-out infinite; }
.tag-b { bottom: 17%; left: -3%; animation: float 7s ease-in-out infinite reverse; }
.tag-c {
  bottom: 4%;
  right: 14%;
  font-size: 10.5px;
  color: var(--muted);
  padding: 7px 12px;
  letter-spacing: 0.06em;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

.hero-brandbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 46px;
  padding: 16px 22px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.015);
  font-size: 11.5px;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.hero-brandbar span:first-child {
  font-family: var(--mono);
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.12em;
}

.sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.6;
}

/* ------------------------------ مدل‌ها ------------------------------ */
.model-section {
  padding-top: 46px;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.model-card {
  display: grid;
  gap: 2px;
  padding: 16px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.model-card:hover {
  border-color: rgba(255, 59, 47, 0.45);
  transform: translateY(-2px);
}

.model-code {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.model-years {
  font-size: 10.5px;
  color: var(--muted-2);
  direction: ltr;
  text-align: right;
}

.model-count {
  margin-top: 6px;
  font-size: 11px;
  color: #ff8d84;
}

/* ------------------------------ دسته‌ها ------------------------------ */
.cat-section {
  padding-top: 0;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 13px;
  border: 1px solid var(--line);
  background: var(--panel);
  transition: border-color 0.18s ease, background 0.18s ease;
}

.cat-card:hover {
  border-color: #3a4655;
  background: var(--panel-2);
}

.cat-art {
  width: 54px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #0b0f14;
  border: 1px solid var(--line-soft);
  padding: 4px;
}

.cat-info {
  display: grid;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.cat-info strong {
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.6;
}

.cat-info small {
  font-size: 10.5px;
  color: var(--muted-2);
}

.cat-arrow {
  color: var(--muted-2);
  transform: rotate(180deg);
  flex-shrink: 0;
}

.cat-card:hover .cat-arrow {
  color: var(--accent);
}

/* ----------------------------- محصولات ----------------------------- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* ------------------------------ بنر ------------------------------ */
.promo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 24px 28px;
  border-radius: 18px;
  border: 1px solid rgba(255, 176, 32, 0.22);
  background:
    radial-gradient(60% 120% at 88% 50%, rgba(255, 176, 32, 0.13), transparent 60%),
    linear-gradient(120deg, #14100a, #0d1116 55%);
  overflow: hidden;
}

.promo-art {
  width: 110px;
  height: 96px;
  flex-shrink: 0;
  padding: 6px;
  border-radius: 12px;
  background: #0a0d11;
  border: 1px solid var(--line-soft);
}

.promo-copy {
  flex: 1;
  display: grid;
  gap: 7px;
  justify-items: start;
}

.promo-copy h3 {
  font-size: 20px;
  font-weight: 800;
}

.promo-copy p {
  font-size: 12.5px;
  color: var(--muted);
  max-width: 620px;
  line-height: 1.9;
}

.promo-prices {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.promo-btn {
  flex-shrink: 0;
}

/* ------------------------------- چرا ------------------------------- */
.why-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 44px;
  align-items: start;
}

.why-copy p {
  margin-top: 14px;
  font-size: 14px;
  line-height: 2.1;
}

.why-link {
  display: inline-block;
  margin-top: 18px;
  color: #ff8d84;
  font-size: 13px;
  font-weight: 700;
}

.why-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.why-card {
  padding: 18px;
  border-radius: 13px;
  border: 1px solid var(--line);
  background: var(--panel);
}

.why-num {
  font-size: 11px;
  color: rgba(255, 59, 47, 0.75);
  letter-spacing: 0.08em;
}

.why-card h4 {
  margin-top: 6px;
  font-size: 13.5px;
  font-weight: 700;
}

.why-card p {
  margin-top: 5px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
}

/* ------------------------------- شعب ------------------------------- */
.branches-section {
  padding-top: 0;
}

.branch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.branch-card {
  padding: 18px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: linear-gradient(160deg, #0f141a, #0b0f14);
}

.branch-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.branch-city {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.branch-card h4 {
  font-size: 14px;
  font-weight: 800;
}

.branch-address {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
  min-height: 44px;
}

.branch-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  font-size: 11px;
  color: var(--muted-2);
}

.branch-meta a {
  color: #e9eef4;
  font-weight: 700;
}

/* -------------------------------- CTA -------------------------------- */
.cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  flex-wrap: wrap;
  padding: 34px;
  border-radius: 20px;
  border: 1px solid rgba(255, 59, 47, 0.25);
  background: linear-gradient(120deg, #150e0d, #0c1015);
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  inset-inline-end: -60px;
  top: -70px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 59, 47, 0.25), transparent 65%);
}

.cta p {
  margin-top: 8px;
  font-size: 13px;
  color: var(--muted);
  max-width: 560px;
  line-height: 2;
}

.cta-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ----------------------------- ریسپانسیو ----------------------------- */
@media (max-width: 1080px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-visual { max-width: 460px; margin-inline: auto; }
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .cat-grid { grid-template-columns: repeat(2, 1fr); }
  .model-grid { grid-template-columns: repeat(4, 1fr); }
  .why-grid { grid-template-columns: 1fr; gap: 26px; }
}

@media (max-width: 720px) {
  .hero { padding-top: 34px; }
  .hero-stats { gap: 20px; }
  .hero-stats dt { font-size: 21px; }
  .hero-brandbar { justify-content: center; }
  .hero-brandbar .sep { display: none; }
  /* در موبایل کارت‌های شناور زیر تصویر و در جریان عادی صفحه قرار می‌گیرند
     تا روی متن هم و روی هم نیفتند */
  .hero-visual {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 340px;
    margin-inline: auto;
  }
  .hero-tag {
    position: static;
    width: 100%;
    animation: none;
  }
  .tag-c { justify-content: center; }
  .hero-art { width: 82%; height: 82%; }
  .hero-tag { padding: 9px 11px; }
  .model-grid { grid-template-columns: repeat(2, 1fr); }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .promo { flex-wrap: wrap; padding: 18px; }
  .promo-art { width: 74px; height: 66px; }
  .promo-btn { width: 100%; }
  .branch-grid { grid-template-columns: 1fr; }
  .why-cards { grid-template-columns: 1fr; }
  .cta { padding: 22px; }
  .cta-actions { width: 100%; }
  .cta-actions .btn { flex: 1; }
}

@media (max-width: 460px) {
  .cat-grid { grid-template-columns: 1fr; }
  .product-grid { grid-template-columns: 1fr; }
  .hero-chips { gap: 4px; }
}
</style>
