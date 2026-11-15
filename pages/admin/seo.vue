<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();
const config = useRuntimeConfig();

const { data, refresh } = await useAsyncData('admin:seo', () => api<any>('/api/admin/seo'));

const pages = computed<any[]>(() => data.value?.pages || []);
const overview = computed<any>(() => data.value?.overview || {});

const selected = ref('home');
const saving = ref(false);

const form = reactive({
  label: '',
  title: '',
  description: '',
  keywords: '',
  ogImage: '',
  canonical: '',
  robots: 'index,follow',
});

const robotsOptions = [
  ['index,follow', 'ایندکس شود و لینک‌ها دنبال شوند (پیشنهادی)'],
  ['noindex,follow', 'ایندکس نشود، لینک‌ها دنبال شوند'],
  ['index,nofollow', 'ایندکس شود، لینک‌ها دنبال نشوند'],
  ['noindex,nofollow', 'نه ایندکس، نه دنبال کردن'],
];

const paths: Record<string, string> = {
  home: '/',
  shop: '/products',
  product: '/products/lent-tormoz-jolo-mvm-315',
  category: '/category/brake',
  contact: '/contact',
  branches: '/branches',
};

const isTemplate = computed(() => ['product', 'category'].includes(selected.value));

const activePage = computed(() => pages.value.find((p) => p.key === selected.value));

watch(
  [selected, pages],
  () => {
    const page = activePage.value;
    if (!page) return;
    Object.assign(form, {
      label: page.label || '',
      title: page.title || '',
      description: page.description || '',
      keywords: page.keywords || '',
      ogImage: page.ogImage || '',
      canonical: page.canonical || '',
      robots: page.robots || 'index,follow',
    });
  },
  { immediate: true },
);

const titleTone = computed(() =>
  form.title.length === 0 ? 'bad' : form.title.length <= 60 && form.title.length >= 30 ? 'ok' : 'warn',
);
const descTone = computed(() =>
  form.description.length === 0
    ? 'bad'
    : form.description.length <= 160 && form.description.length >= 110
      ? 'ok'
      : 'warn',
);

const checklist = computed(() => [
  {
    label: 'طول عنوان بین ۳۰ تا ۶۰ کاراکتر',
    ok: form.title.length >= 30 && form.title.length <= 60,
    value: `${faNum(form.title.length)} کاراکتر`,
  },
  {
    label: 'توضیحات بین ۱۱۰ تا ۱۶۰ کاراکتر',
    ok: form.description.length >= 110 && form.description.length <= 160,
    value: `${faNum(form.description.length)} کاراکتر`,
  },
  { label: 'کلمات کلیدی تعریف شده', ok: form.keywords.trim().length > 0, value: `${faNum(form.keywords.split(',').filter(Boolean).length)} کلمه` },
  { label: 'صفحه برای موتور جستجو ایندکس می‌شود', ok: form.robots.includes('index'), value: form.robots },
  { label: 'تصویر اشتراک‌گذاری (OG) تنظیم شده', ok: form.ogImage.trim().length > 0, value: form.ogImage ? 'تنظیم‌شده' : 'خالی' },
]);

const health = computed(() => {
  const passed = checklist.value.filter((c) => c.ok).length;
  return Math.round((passed / checklist.value.length) * 100);
});

const previewUrl = computed(() => {
  const base = (config.public.siteUrl || 'http://localhost:3000').replace(/^https?:\/\//, '');
  return `${base}${paths[selected.value] || '/'}`;
});

const save = async () => {
  saving.value = true;
  try {
    await api(`/api/admin/seo/${selected.value}`, { method: 'PUT', body: { ...form } });
    await refresh();
    toast.push('تنظیمات سئو ذخیره شد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    saving.value = false;
  }
};

useHead({ title: 'مدیریت سئو | پنل یدک سیستم' });
</script>

<template>
  <div v-if="data">
    <div class="page-head">
      <div>
        <span class="eyebrow">بهینه‌سازی موتور جستجو</span>
        <h1 class="h2">مدیریت سئوی سایت</h1>
        <p class="muted small">
          عنوان، توضیحات و تنظیمات متای هر صفحه را از اینجا مدیریت کنید؛ تغییرات بلافاصله روی سایت اعمال می‌شود.
        </p>
      </div>
      <div class="head-actions">
        <a href="/sitemap.xml" target="_blank" class="btn btn-outline btn-sm">نقشه سایت</a>
        <a href="/robots.txt" target="_blank" class="btn btn-outline btn-sm">robots.txt</a>
        <button type="button" class="btn btn-primary btn-sm" :disabled="saving" @click="save">
          {{ saving ? 'در حال ذخیره…' : 'ذخیره تنظیمات' }}
        </button>
      </div>
    </div>

    <div class="overview-grid">
      <div class="ov-card">
        <span>صفحات مدیریت‌شده</span>
        <strong>{{ faNum(overview.pages || 0) }}</strong>
      </div>
      <div class="ov-card">
        <span>محصولات فعال</span>
        <strong>{{ faNum(overview.products || 0) }}</strong>
      </div>
      <div class="ov-card" :class="{ warn: overview.missingDescription > 0 }">
        <span>محصول با توضیح کوتاه ضعیف</span>
        <strong>{{ faNum(overview.missingDescription || 0) }}</strong>
      </div>
      <div class="ov-card" :class="{ warn: overview.noindex > 0 }">
        <span>صفحه noindex</span>
        <strong>{{ faNum(overview.noindex || 0) }}</strong>
      </div>
      <div class="ov-card score">
        <span>امتیاز سلامت سئو</span>
        <strong>{{ faNum(overview.healthScore || 0) }}<small>/۱۰۰</small></strong>
      </div>
    </div>

    <div class="seo-layout">
      <aside class="panel page-list">
        <div class="panel-head">
          <span class="panel-title">صفحات سایت</span>
        </div>
        <button
          v-for="p in pages"
          :key="p.key"
          type="button"
          class="page-item"
          :class="{ active: selected === p.key }"
          @click="selected = p.key"
        >
          <span class="page-dot" :class="{ noindex: (p.robots || '').includes('noindex') }" />
          <span class="page-info">
            <strong>{{ p.label }}</strong>
            <small class="mono">{{ paths[p.key] || `/…/${p.key}` }}</small>
          </span>
          <span class="tiny muted">{{ (p.title || '').length }}</span>
        </button>

        <div class="seo-tips">
          <strong>راهنمای سریع</strong>
          <ul>
            <li>عنوان اصلی صفحه حاوی کلمه کلیدی باشد.</li>
            <li>توضیحات باید ارزش کلیک داشته باشد.</li>
            <li>صفحات شخصی (پنل، سبد خرید) را noindex کنید.</li>
            <li>پس از تغییر، نقشه سایت به‌روز می‌شود.</li>
          </ul>
        </div>
      </aside>

      <div class="editor-col">
        <section class="panel panel-pad">
          <div class="editor-head">
            <div>
              <h3 class="block-title">{{ activePage?.label || 'صفحه' }}</h3>
              <p v-if="isTemplate" class="tiny muted template-note">
                این یک «قالب» است؛ از متغیرهای
                <code>{name}</code>، <code>{category}</code> و <code>{shortDesc}</code> استفاده کنید.
              </p>
            </div>
            <a :href="paths[selected]" target="_blank" class="tiny accent-link">مشاهده صفحه ←</a>
          </div>

          <div class="stack">
            <div class="field">
              <div class="counter-row">
                <label for="seo-title">عنوان متا (Title)</label>
                <span class="counter" :class="titleTone">{{ form.title.length }} / ۶۰</span>
              </div>
              <input id="seo-title" v-model="form.title" class="input" type="text" />
            </div>

            <div class="field">
              <div class="counter-row">
                <label for="seo-desc">توضیحات متا (Description)</label>
                <span class="counter" :class="descTone">{{ form.description.length }} / ۱۶۰</span>
              </div>
              <textarea id="seo-desc" v-model="form.description" class="textarea" rows="3" />
            </div>

            <div class="field">
              <label for="seo-keywords">کلمات کلیدی (با کاما جدا کنید)</label>
              <input id="seo-keywords" v-model="form.keywords" class="input" type="text" />
            </div>

            <div class="form-grid">
              <div class="field">
                <label for="seo-canonical">آدرس Canonical (اختیاری)</label>
                <input id="seo-canonical" v-model="form.canonical" class="input mono" type="text" dir="ltr" placeholder="https://…" />
              </div>
              <div class="field">
                <label for="seo-og">تصویر اشتراک‌گذاری (OG Image)</label>
                <input id="seo-og" v-model="form.ogImage" class="input mono" type="text" dir="ltr" />
              </div>
              <div class="field span-2">
                <label for="seo-robots">دستور ایندکس (Robots)</label>
                <select id="seo-robots" v-model="form.robots" class="select">
                  <option v-for="[value, label] in robotsOptions" :key="value" :value="value">{{ label }}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <div class="preview-row">
          <section class="panel serp">
            <div class="panel-head">
              <span class="panel-title">پیش‌نمایش نتیجه گوگل</span>
              <span class="badge" :class="form.robots.includes('noindex') ? 'badge-danger' : 'badge-ok'">
                {{ form.robots.includes('noindex') ? 'ایندکس نمی‌شود' : 'قابل ایندکس' }}
              </span>
            </div>
            <div class="serp-body">
              <span class="serp-url">{{ previewUrl }}</span>
              <span class="serp-title">{{ form.title || 'عنوان صفحه را وارد کنید' }}</span>
              <span class="serp-desc">{{ form.description || 'توضیحات متای صفحه در نتایج گوگل اینجا نمایش داده می‌شود.' }}</span>
            </div>
          </section>

          <section class="panel checklist">
            <div class="panel-head">
              <span class="panel-title">چک‌لیست سئو</span>
              <span class="score-badge" :class="health >= 80 ? 'ok' : health >= 50 ? 'mid' : 'bad'">{{ faNum(health) }}٪</span>
            </div>
            <ul class="check-list">
              <li v-for="item in checklist" :key="item.label" :class="{ ok: item.ok }">
                <span class="check-icon">{{ item.ok ? '✓' : '!' }}</span>
                <span class="check-label">{{ item.label }}</span>
                <span class="check-value mono">{{ item.value }}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.head-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.ov-card {
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--panel);
  display: grid;
  gap: 2px;
}

.ov-card span { font-size: 10.5px; color: var(--muted-2); }
.ov-card strong { font-size: 19px; font-weight: 900; }
.ov-card.warn strong { color: #ffc55c; }
.ov-card.score strong { color: #58e2a1; }
.ov-card.score small { font-size: 10px; color: var(--muted-2); font-weight: 500; }

.seo-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.page-list {
  padding: 8px;
}

.page-list .panel-head {
  padding: 8px 10px 12px;
  border-bottom: 1px solid var(--line-soft);
}

.page-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #c3cdd9;
  font-family: inherit;
  text-align: right;
  cursor: pointer;
}

.page-item:hover { background: rgba(255, 255, 255, 0.04); }

.page-item.active {
  background: rgba(255, 59, 47, 0.1);
  color: #fff;
}

.page-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ok);
  flex-shrink: 0;
}

.page-dot.noindex { background: var(--danger); }

.page-info {
  display: grid;
  flex: 1;
  min-width: 0;
  line-height: 1.5;
}

.page-info strong { font-size: 11.5px; }

.page-info small {
  font-size: 9.5px;
  color: var(--muted-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: ltr;
  text-align: right;
}

.seo-tips {
  margin-top: 8px;
  padding: 11px;
  border-radius: 9px;
  background: rgba(74, 168, 255, 0.05);
  border: 1px solid rgba(74, 168, 255, 0.14);
}

.seo-tips strong { font-size: 10.5px; color: #9ccbff; }

.seo-tips ul {
  margin-top: 6px;
  display: grid;
  gap: 4px;
  font-size: 10px;
  color: var(--muted);
  line-height: 1.8;
}

.editor-col { display: grid; gap: 12px; }

.editor-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.block-title {
  font-size: 13.5px;
  font-weight: 800;
}

.template-note {
  margin-top: 4px;
  line-height: 1.8;
}

.template-note code {
  font-family: var(--mono);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 10px;
  direction: ltr;
  display: inline-block;
}

.accent-link { color: #ff8d84; white-space: nowrap; }

.counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.counter {
  font-size: 10px;
  font-family: var(--mono);
  color: var(--muted-2);
}

.counter.ok { color: #58e2a1; }
.counter.warn { color: #ffc55c; }
.counter.bad { color: #ff8d9b; }

.preview-row {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 12px;
}

.serp-body {
  display: grid;
  gap: 4px;
  padding: 18px;
  background: #fff;
  border-radius: 0 0 12px 12px;
}

.serp-url {
  font-size: 11.5px;
  color: #4d5156;
  direction: ltr;
  text-align: left;
  font-family: var(--mono);
}

.serp-title {
  font-size: 17px;
  color: #1a0dab;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.serp-desc {
  font-size: 12.5px;
  color: #4d5156;
  line-height: 1.8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.score-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
}

.score-badge.ok { background: rgba(47, 208, 125, 0.12); color: #58e2a1; }
.score-badge.mid { background: rgba(255, 176, 32, 0.12); color: #ffc55c; }
.score-badge.bad { background: rgba(255, 84, 104, 0.12); color: #ff8d9b; }

.check-list {
  display: grid;
  gap: 2px;
  padding: 12px;
}

.check-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 6px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 11px;
  color: #c3cdd9;
}

.check-list li:last-child { border-bottom: none; }

.check-icon {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 800;
  background: rgba(255, 84, 104, 0.14);
  color: #ff8d9b;
  flex-shrink: 0;
}

.check-list li.ok .check-icon {
  background: rgba(47, 208, 125, 0.14);
  color: #58e2a1;
}

.check-label { flex: 1; }

.check-value {
  font-size: 9.5px;
  color: var(--muted-2);
  text-align: left;
}

@media (max-width: 1100px) {
  .overview-grid { grid-template-columns: 1fr 1fr 1fr; }
  .preview-row { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .seo-layout { grid-template-columns: 1fr; }
  .page-list { position: static; }
}
</style>
