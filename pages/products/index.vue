<script setup lang="ts">
const route = useRoute();
const router = useRouter();

usePageSeo('shop', {
  title: 'خرید آنلاین قطعات MVM | یدک سیستم — نمایندگی فلاحی یزد',
  description:
    'خرید آنلاین قطعات و لوازم یدکی MVM با فیلتر بر اساس مدل خودرو، دسته‌بندی و قیمت. ارسال به سراسر ایران از یزد.',
});

const q = computed(() => route.query as Record<string, string>);

const params = computed(() => {
  const out: Record<string, any> = { limit: 12, page: Number(q.value.page || 1) };
  for (const key of ['search', 'category', 'model', 'minPrice', 'maxPrice', 'sort', 'inStock', 'featured']) {
    if (q.value[key]) out[key] = q.value[key];
  }
  return out;
});

const { data, pending } = await useAsyncData(
  'shop:products',
  () => $fetch<any>('/api/products', { query: params.value }),
  { watch: [params] },
);

const { data: facets } = await useAsyncData('shop:facets', () => $fetch<any>('/api/facets'));

const showFilters = ref(false);
const priceMin = ref(q.value.minPrice || '');
const priceMax = ref(q.value.maxPrice || '');

watch(
  () => route.query,
  () => {
    priceMin.value = q.value.minPrice || '';
    priceMax.value = q.value.maxPrice || '';
  },
);

const apply = (patch: Record<string, any>, resetPage = true) => {
  const next: Record<string, any> = { ...route.query, ...patch };
  if (resetPage) delete next.page;
  Object.keys(next).forEach((key) => {
    if (next[key] === '' || next[key] === undefined || next[key] === null) delete next[key];
  });
  router.push({ path: '/products', query: next });
  showFilters.value = false;
};

const applyPrice = () => apply({ minPrice: priceMin.value, maxPrice: priceMax.value });

const resetAll = () => router.push({ path: '/products' });

const activeFilterCount = computed(
  () =>
    ['search', 'category', 'model', 'minPrice', 'maxPrice', 'inStock'].filter((k) => q.value[k]).length,
);

const pageList = computed(() => {
  const total = data.value?.pages || 1;
  const current = data.value?.page || 1;
  const arr = [...new Set([1, total, current, current - 1, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | string)[] = [];
  arr.forEach((n, i) => {
    if (i && Number(n) - Number(arr[i - 1]) > 1) out.push('…');
    out.push(n);
  });
  return out;
});

const activeModel = computed(() => facets.value?.models.find((m: any) => m.slug === q.value.model));
const activeCategory = computed(() =>
  facets.value?.categories.find((c: any) => c.slug === q.value.category),
);
</script>

<template>
  <div class="shop-page">
    <div class="page-head">
      <div class="container">
        <nav class="crumbs" aria-label="مسیر صفحه">
          <NuxtLink to="/">خانه</NuxtLink>
          <span>/</span>
          <NuxtLink to="/products">فروشگاه قطعات</NuxtLink>
          <template v-if="activeCategory">
            <span>/</span>
            <span>{{ activeCategory.name }}</span>
          </template>
        </nav>

        <div class="head-row">
          <div>
            <h1 class="h1">
              {{ activeModel ? `قطعات ${activeModel.name}` : activeCategory ? activeCategory.name : 'فروشگاه قطعات MVM' }}
            </h1>
            <p class="muted">
              {{ activeCategory?.name ? activeCategory.name : 'قطعات اصلی و OEM برای همه مدل‌های MVM' }}
              — موجودی واقعی انبار یزد، با ضمانت اصالت و ارسال سریع.
            </p>
          </div>
          <div class="head-stats">
            <span class="head-stat">{{ faNum(data?.total || 0) }} قطعه</span>
            <span class="head-stat">فیلتر فعال: {{ faNum(activeFilterCount) }}</span>
          </div>
        </div>

        <div v-if="facets" class="model-strip">
          <button
            type="button"
            class="model-filter"
            :class="{ active: !q.model }"
            @click="apply({ model: '' })"
          >
            همه مدل‌ها
          </button>
          <button
            v-for="m in facets.models"
            :key="m.slug"
            type="button"
            class="model-filter mono"
            :class="{ active: q.model === m.slug }"
            @click="apply({ model: q.model === m.slug ? '' : m.slug })"
          >
            {{ m.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="container shop-layout">
      <aside class="filters" :class="{ open: showFilters }">
        <div class="filters-head">
          <strong>فیلتر قطعات</strong>
          <button v-if="activeFilterCount" type="button" class="reset" @click="resetAll">پاک‌کردن</button>
          <button type="button" class="close-filters" aria-label="بستن فیلترها" @click="showFilters = false">×</button>
        </div>

        <form class="filter-block" @submit.prevent="applyPrice">
          <span class="filter-title">جستجوی کد فنی</span>
          <input
            :value="q.search || ''"
            class="input"
            type="search"
            placeholder="کد فنی یا نام قطعه"
            aria-label="جستجو در نتایج"
            @change="apply({ search: ($event.target as HTMLInputElement).value })"
          />
        </form>

        <div v-if="facets" class="filter-block">
          <span class="filter-title">دسته‌بندی</span>
          <ul class="filter-list">
            <li>
              <button
                type="button"
                class="filter-link"
                :class="{ active: !q.category }"
                @click="apply({ category: '' })"
              >
                <span>همه دسته‌ها</span>
                <span class="filter-count">{{ faNum(facets.categories.reduce((s: number, c: any) => s + c.count, 0)) }}</span>
              </button>
            </li>
            <li v-for="cat in facets.categories" :key="cat.slug">
              <button
                type="button"
                class="filter-link"
                :class="{ active: q.category === cat.slug }"
                @click="apply({ category: q.category === cat.slug ? '' : cat.slug })"
              >
                <span>{{ cat.name }}</span>
                <span class="filter-count">{{ faNum(cat.count) }}</span>
              </button>
            </li>
          </ul>
        </div>

        <form class="filter-block" @submit.prevent="applyPrice">
          <span class="filter-title">محدوده قیمت (تومان)</span>
          <div class="price-row">
            <input v-model="priceMin" class="input" type="number" min="0" placeholder="از" aria-label="حداقل قیمت" />
            <input v-model="priceMax" class="input" type="number" min="0" placeholder="تا" aria-label="حداکثر قیمت" />
          </div>
          <button type="submit" class="btn btn-outline btn-sm btn-block">اعمال قیمت</button>
        </form>

        <div class="filter-block">
          <label class="checkbox">
            <input
              type="checkbox"
              :checked="q.inStock === '1'"
              @change="apply({ inStock: q.inStock === '1' ? '' : '1' })"
            />
            فقط قطعات موجود
          </label>
          <label class="checkbox">
            <input
              type="checkbox"
              :checked="q.featured === '1'"
              @change="apply({ featured: q.featured === '1' ? '' : '1' })"
            />
            پیشنهاد نمایندگی
          </label>
        </div>

        <div class="filter-help">
          <strong>قطعه را پیدا نمی‌کنید؟</strong>
          <p>کد VIN خودرو را بفرستید تا برایتان پیدا کنیم.</p>
          <NuxtLink to="/contact" class="btn btn-primary btn-sm btn-block">استعلام قطعه</NuxtLink>
        </div>
      </aside>

      <div class="shop-main">
        <div class="toolbar">
          <div class="toolbar-left">
            <button type="button" class="btn btn-outline btn-sm filter-toggle" @click="showFilters = true">
              فیلترها <span v-if="activeFilterCount">({{ faNum(activeFilterCount) }})</span>
            </button>
            <span class="result-count">
              {{ pending ? 'در حال بارگذاری…' : `${faNum(data?.total || 0)} قطعه یافت شد` }}
            </span>
          </div>

          <label class="sort-label">
            <span>مرتب‌سازی:</span>
            <select
              class="select sort-select"
              :value="q.sort || 'default'"
              aria-label="مرتب‌سازی نتایج"
              @change="apply({ sort: ($event.target as HTMLSelectElement).value })"
            >
              <option value="default">پیشنهاد ما</option>
              <option value="popular">پرفروش‌ترین</option>
              <option value="newest">جدیدترین</option>
              <option value="cheap">ارزان‌ترین</option>
              <option value="expensive">گران‌ترین</option>
              <option value="discount">بیشترین تخفیف</option>
              <option value="rating">بهترین امتیاز</option>
            </select>
          </label>
        </div>

        <div v-if="q.search" class="search-chip">
          نتایج جستجو برای «{{ q.search }}»
          <button type="button" aria-label="حذف جستجو" @click="apply({ search: '' })">×</button>
        </div>

        <div v-if="pending" class="product-grid shop-grid">
          <div v-for="i in 9" :key="i" class="skeleton card-skeleton" />
        </div>

        <div v-else-if="data && data.items.length" class="product-grid shop-grid">
          <ProductCard v-for="p in data.items" :key="p.id" :product="p" />
        </div>

        <div v-else class="empty panel">
          <h3>قطعه‌ای با این مشخصات پیدا نشد</h3>
          <p>فیلترها را ساده‌تر کنید یا از فرم استعلام قطعه استفاده کنید.</p>
          <div class="row">
            <button type="button" class="btn btn-outline btn-sm" @click="resetAll">حذف فیلترها</button>
            <NuxtLink to="/contact" class="btn btn-primary btn-sm">استعلام قطعه</NuxtLink>
          </div>
        </div>

        <nav v-if="data && data.pages > 1" class="pagination" aria-label="صفحه‌بندی">
          <button
            type="button"
            class="page-btn"
            :disabled="data.page <= 1"
            @click="apply({ page: data.page - 1 }, false)"
          >
            قبلی
          </button>
          <template v-for="(n, i) in pageList" :key="i">
            <span v-if="n === '…'" class="page-gap">…</span>
            <button
              v-else
              type="button"
              class="page-btn"
              :class="{ active: n === data.page }"
              @click="apply({ page: n }, false)"
            >
              {{ faNum(n) }}
            </button>
          </template>
          <button
            type="button"
            class="page-btn"
            :disabled="data.page >= data.pages"
            @click="apply({ page: data.page + 1 }, false)"
          >
            بعدی
          </button>
        </nav>
      </div>
    </div>

    <div v-if="showFilters" class="filters-backdrop" @click="showFilters = false" />
  </div>
</template>

<style scoped>
.shop-page {
  padding-bottom: 40px;
}

.page-head {
  background:
    radial-gradient(60% 120% at 90% 0%, rgba(255, 59, 47, 0.13), transparent 65%),
    linear-gradient(180deg, #0b0e13, transparent);
  border-bottom: 1px solid var(--line-soft);
  padding-block: 26px 20px;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 14px;
}

.crumbs a:hover {
  color: #fff;
}

.head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.h1 {
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.head-row p {
  margin-top: 6px;
  font-size: 13px;
  max-width: 640px;
}

.head-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.head-stat {
  padding: 5px 11px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  font-size: 11.5px;
  color: var(--muted);
}

.model-strip {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  margin-top: 20px;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.model-filter {
  flex-shrink: 0;
  padding: 7px 13px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0b0f14;
  color: #b9c4d1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
}

.model-filter.active,
.model-filter:hover {
  border-color: rgba(255, 59, 47, 0.5);
  background: rgba(255, 59, 47, 0.1);
  color: #fff;
}

.shop-layout {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  gap: 24px;
  margin-top: 26px;
  align-items: start;
}

.filters {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  position: sticky;
  top: 174px;
}

.filters-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.reset {
  border: none;
  background: transparent;
  color: #ff8d84;
  font-size: 11.5px;
  cursor: pointer;
}

.close-filters {
  display: none;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.filter-block {
  display: grid;
  gap: 9px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
}

.filter-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #c9d3de;
}

.filter-list {
  display: grid;
  gap: 2px;
}

.filter-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #b3bfcc;
  font-family: inherit;
  font-size: 12px;
  text-align: right;
  cursor: pointer;
}

.filter-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.filter-link.active {
  background: rgba(255, 59, 47, 0.1);
  color: #ffb4ad;
}

.filter-count {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--muted-2);
}

.price-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.price-row .input {
  padding: 8px 10px;
  font-size: 12px;
}

.filter-help {
  display: grid;
  gap: 7px;
  padding: 13px;
  border-radius: 10px;
  background: rgba(255, 59, 47, 0.06);
  border: 1px solid rgba(255, 59, 47, 0.18);
}

.filter-help strong {
  font-size: 12px;
}

.filter-help p {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.8;
}

.shop-main {
  min-width: 0;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.015);
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-toggle {
  display: none;
}

.result-count {
  font-size: 12px;
  color: var(--muted);
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
  padding: 7px 30px 7px 12px;
  font-size: 12px;
  height: 34px;
}

.search-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 6px 11px;
  border-radius: 8px;
  background: rgba(74, 168, 255, 0.08);
  border: 1px solid rgba(74, 168, 255, 0.2);
  color: #9ccbff;
  font-size: 12px;
}

.search-chip button {
  border: none;
  background: transparent;
  color: inherit;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
}

.shop-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.card-skeleton {
  height: 330px;
  border: 1px solid var(--line);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0b0f14;
  color: #c3cdd9;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  border-color: #3c4756;
  color: #fff;
}

.page-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 700;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-gap {
  color: var(--muted-2);
  padding: 0 4px;
}

.filters-backdrop {
  display: none;
}

@media (max-width: 1080px) {
  .shop-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 900px) {
  .shop-layout { grid-template-columns: 1fr; }
  .filters {
    position: fixed;
    inset-block: 0;
    inset-inline-end: 0;
    width: min(320px, 88vw);
    z-index: 120;
    border-radius: 0;
    overflow-y: auto;
    transform: translateX(-105%);
    transition: transform 0.24s ease;
    top: 0;
    border-inline-end: 1px solid var(--line);
  }
  .filters.open { transform: translateX(0); }
  .close-filters { display: block; }
  .filter-toggle { display: inline-flex; }
  .filters-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 110;
  }
}

@media (max-width: 480px) {
  .shop-grid { grid-template-columns: 1fr; }
  .sort-label span { display: none; }
  .sort-select { width: 138px; }
}
</style>
