<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const slug = String(route.params.slug);

const { data: categories } = await useAsyncData('all:categories', () => $fetch<any[]>('/api/categories'), {
  default: () => [],
});

const category = computed(() => categories.value.find((c) => c.slug === slug));

const artMap: Record<string, string> = {
  engine: 'engine',
  brake: 'disc',
  electrical: 'battery',
  suspension: 'shock',
  cooling: 'radiator',
  body: 'mirror',
  fluids: 'fluid',
};
const catArt = computed(() => artMap[slug] || 'filter');

const sort = computed(() => String(route.query.sort || 'default'));
const page = computed(() => Number(route.query.page || 1));

const { data } = await useAsyncData(
  `category:${slug}`,
  () =>
    $fetch<any>('/api/products', {
      query: { category: slug, limit: 12, page: page.value, sort: sort.value },
    }),
  { watch: [sort, page] },
);

usePageSeo(
  'category',
  {
    title: `${category.value?.name || 'دسته‌بندی'} MVM | یدک سیستم — نمایندگی فلاحی یزد`,
    description: `خرید آنلاین ${category.value?.name || 'قطعات'} خودروهای MVM با تنوع کامل و ضمانت اصالت از یدک سیستم — نمایندگی MVM فلاحی یزد.`,
  },
  { category: category.value?.name || 'قطعات MVM' },
);

const setSort = (value: string) =>
  router.push({ path: route.path, query: { ...route.query, sort: value, page: undefined } });

const goPage = (p: number) => {
  router.push({ path: route.path, query: { ...route.query, page: p } });
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
};

const pageList = computed(() => {
  const total = data.value?.pages || 1;
  const current = data.value?.page || 1;
  return [...new Set([1, total, current, current - 1, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
});
</script>

<template>
  <div class="cat-page">
    <div class="cat-hero">
      <div class="container cat-hero-inner">
        <nav class="crumbs" aria-label="مسیر صفحه">
          <NuxtLink to="/">خانه</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products">فروشگاه قطعات</NuxtLink>
          <span>/</span>
          <span>{{ category?.name || slug }}</span>
        </nav>

        <div class="cat-hero-grid">
          <div>
            <span class="eyebrow">دسته‌بندی قطعات</span>
            <h1 class="h1">{{ category?.name || 'دسته‌بندی قطعات' }}</h1>
            <p class="muted">
              {{ category?.description || 'قطعات اصلی و OEM سازگار با مدل‌های MVM، موجود در انبار یزد.' }}
            </p>
            <div class="cat-meta">
              <span class="tag">{{ faNum(category?.productCount || 0) }} قطعه</span>
              <span class="tag">ضمانت اصالت</span>
              <span class="tag">ارسال سراسری</span>
            </div>
          </div>
          <div class="cat-hero-art">
            <PartArt :kind="catArt" :label="category?.name || slug" />
          </div>
        </div>
      </div>
    </div>

    <div class="container section-sm">
      <div class="cat-tabs">
        <NuxtLink
          v-for="c in categories"
          :key="c.id"
          :to="`/category/${c.slug}`"
          class="cat-tab"
          :class="{ active: c.slug === slug }"
        >
          {{ c.name }}
        </NuxtLink>
      </div>

      <div class="cat-toolbar">
        <span class="muted small">{{ faNum(data?.total || 0) }} قطعه در این دسته</span>
        <label class="sort-label">
          <span>مرتب‌سازی:</span>
          <select class="select sort-select" :value="sort" @change="setSort(($event.target as HTMLSelectElement).value)">
            <option value="default">پیشنهاد ما</option>
            <option value="popular">پرفروش‌ترین</option>
            <option value="cheap">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
            <option value="newest">جدیدترین</option>
          </select>
        </label>
      </div>

      <div v-if="data && data.items.length" class="product-grid">
        <ProductCard v-for="p in data.items" :key="p.id" :product="p" />
      </div>

      <div v-else-if="data" class="empty panel">
        <h3>در این دسته قطعه‌ای ثبت نشده</h3>
        <NuxtLink to="/products" class="btn btn-outline btn-sm">مشاهده همه قطعات</NuxtLink>
      </div>

      <nav v-if="data && data.pages > 1" class="pagination">
        <button v-for="n in pageList" :key="n" type="button" class="page-btn" :class="{ active: n === data.page }" @click="goPage(n)">
          {{ faNum(n) }}
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.cat-hero {
  background:
    radial-gradient(55% 120% at 88% 10%, rgba(255, 59, 47, 0.14), transparent 65%),
    linear-gradient(180deg, #0b0e13, transparent);
  border-bottom: 1px solid var(--line-soft);
  padding-block: 24px 30px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 16px;
}

.cat-hero-grid {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 24px;
  align-items: center;
}

.h1 {
  font-size: clamp(26px, 3.4vw, 40px);
  font-weight: 900;
  letter-spacing: -0.02em;
  margin-top: 8px;
}

.cat-hero-grid p {
  margin-top: 8px;
  max-width: 600px;
  font-size: 13px;
}

.cat-meta {
  display: flex;
  gap: 6px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.cat-hero-art {
  height: 170px;
  padding: 8px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: radial-gradient(circle at 50% 50%, rgba(255, 59, 47, 0.1), #0b0f14 70%);
}

.cat-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line-soft);
}

.cat-tab {
  flex-shrink: 0;
  padding: 7px 13px;
  border-radius: 8px;
  font-size: 12px;
  color: #b3bfcc;
  border: 1px solid transparent;
}

.cat-tab:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.cat-tab.active {
  background: rgba(255, 59, 47, 0.1);
  border-color: rgba(255, 59, 47, 0.3);
  color: #ffb4ad;
}

.cat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: var(--muted);
}

.sort-select {
  width: 150px;
  height: 34px;
  padding: 6px 30px 6px 12px;
  font-size: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 26px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0b0f14;
  color: #c3cdd9;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}

.page-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 700;
}

@media (max-width: 1080px) {
  .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 820px) {
  .cat-hero-grid { grid-template-columns: 1fr; }
  .cat-hero-art { display: none; }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 460px) {
  .product-grid { grid-template-columns: 1fr; }
}
</style>
