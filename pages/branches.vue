<script setup lang="ts">
const config = useRuntimeConfig();
const { data: branches } = await useAsyncData('branches', () => $fetch<any[]>('/api/branches'), {
  default: () => [],
});

usePageSeo('branches', {
  title: 'شعب نمایندگی MVM فلاحی در یزد، میبد و اردکان | یدک سیستم',
  description:
    'آدرس، شماره تماس و ساعات کاری شعب نمایندگی فلاحی برای خرید حضوری قطعات MVM در استان یزد.',
});

const mapUrl = (b: any) =>
  `https://maps.google.com/?q=${encodeURIComponent(`${b.name} ${b.address} ${b.city}`)}`;

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        (branches.value || []).map((b: any) => ({
          '@context': 'https://schema.org',
          '@type': 'AutoPartsStore',
          name: b.name,
          telephone: b.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: b.address,
            addressLocality: b.city,
            addressCountry: 'IR',
          },
          openingHours: b.hours,
          url: `${config.public.siteUrl}/branches`,
        })),
      ),
    },
  ],
});
</script>

<template>
  <div class="branches-page">
    <div class="branch-hero">
      <div class="container">
        <nav class="crumbs">
          <NuxtLink to="/">خانه</NuxtLink><span>/</span><span>شعب نمایندگی</span>
        </nav>
        <span class="eyebrow">حضوری در خدمت شماییم</span>
        <h1 class="display">شعب نمایندگی فلاحی</h1>
        <p class="muted">
          چهار شعبه فعال در استان یزد؛ برای مشاهده قطعه از نزدیک، مشاوره فنی و تحویل حضوری
          سفارش، به نزدیک‌ترین شعبه مراجعه کنید.
        </p>
      </div>
    </div>

    <div class="container">
      <div class="stats-row">
        <div class="stat-box">
          <strong>{{ faNum(branches.length) }}</strong>
          <span>شعبه فعال</span>
        </div>
        <div class="stat-box">
          <strong>۳</strong>
          <span>شهر تحت پوشش</span>
        </div>
        <div class="stat-box">
          <strong>۱۸</strong>
          <span>سال سابقه</span>
        </div>
        <div class="stat-box">
          <strong>۷</strong>
          <span>مدل MVM</span>
        </div>
      </div>

      <div class="branch-list">
        <article v-for="b in branches" :key="b.id" class="branch-item" :class="{ main: b.isMain }">
          <div class="branch-head">
            <div>
              <span class="branch-city mono">{{ b.city }}</span>
              <h2 class="h3">{{ b.name }}</h2>
            </div>
            <span v-if="b.isMain" class="badge badge-accent">شعبه مرکزی و انبار اصلی</span>
          </div>

          <div class="branch-body">
            <div class="branch-details">
              <p class="branch-address">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
                {{ b.address }}
              </p>
              <p>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
                {{ b.hours }}
              </p>
              <p>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
                <span class="mono">{{ b.phone }}</span>
                <span v-if="b.mobile" class="mobile mono">— {{ b.mobile }}</span>
              </p>
            </div>

            <div class="branch-actions">
              <a :href="`tel:${String(b.phone || '').replace(/-/g, '')}`" class="btn btn-primary btn-sm">تماس با شعبه</a>
              <a :href="mapUrl(b)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">مسیریابی</a>
            </div>
          </div>
        </article>
      </div>

      <div class="branch-cta panel">
        <div>
          <h2 class="h3">سفارش آنلاین، تحویل از نزدیک‌ترین شعبه</h2>
          <p class="muted small">
            در مرحله ثبت سفارش می‌توانید درخواست تحویل حضوری بدهید؛ کارشناس شعبه آماده‌سازی
            قطعه را هماهنگ می‌کند.
          </p>
        </div>
        <NuxtLink to="/products" class="btn btn-primary">شروع خرید</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.branches-page {
  padding-bottom: 50px;
}

.branch-hero {
  padding-block: 24px 30px;
  background: radial-gradient(60% 120% at 80% 0%, rgba(255, 59, 47, 0.14), transparent 65%);
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 24px;
}

.crumbs {
  display: flex;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 16px;
}

.branch-hero .display {
  font-size: clamp(30px, 4vw, 44px);
  margin-top: 6px;
}

.branch-hero p {
  margin-top: 10px;
  max-width: 640px;
  font-size: 13px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 22px;
}

.stat-box {
  display: grid;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}

.stat-box strong {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
}

.stat-box span {
  font-size: 11px;
  color: var(--muted-2);
}

.branch-list {
  display: grid;
  gap: 12px;
}

.branch-item {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
}

.branch-item.main {
  border-color: rgba(255, 59, 47, 0.32);
  background:
    radial-gradient(50% 140% at 95% 0%, rgba(255, 59, 47, 0.1), transparent 60%),
    var(--panel);
}

.branch-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.branch-city {
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.branch-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.branch-details {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
}

.branch-details p {
  display: flex;
  align-items: center;
  gap: 7px;
}

.branch-details svg {
  color: var(--muted-2);
  flex-shrink: 0;
}

.mobile {
  color: var(--muted-2);
  font-size: 11px;
}

.branch-actions {
  display: flex;
  gap: 7px;
}

.branch-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding: 20px;
}

.branch-cta p {
  margin-top: 5px;
  line-height: 1.9;
}

@media (max-width: 760px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .branch-body { align-items: flex-start; }
  .branch-actions { width: 100%; }
  .branch-actions .btn { flex: 1; }
}
</style>
