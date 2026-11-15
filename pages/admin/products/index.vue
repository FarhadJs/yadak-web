<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const search = ref('');
const page = ref(1);

const { data, pending, refresh } = await useAsyncData(
  'admin:products',
  () =>
    api<any>('/api/admin/products', {
      query: { search: search.value || undefined, page: page.value, limit: 12 },
    }),
  { watch: [page] },
);

const doSearch = async () => {
  page.value = 1;
  await refresh();
};

const toggleField = async (product: any, field: 'isActive' | 'isFeatured') => {
  try {
    await api(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      body: { [field]: !product[field] },
    });
    await refresh();
    toast.push('وضعیت محصول به‌روزرسانی شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

const remove = async (product: any) => {
  if (!import.meta.client) return;
  if (!window.confirm(`محصول «${product.name}» حذف شود؟ این عمل قابل بازگشت نیست.`)) return;
  try {
    await api(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    await refresh();
    toast.push('محصول حذف شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

useHead({ title: 'مدیریت محصولات | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">مدیریت فروشگاه</span>
        <h1 class="h2">محصولات</h1>
        <p class="muted small">{{ faNum(data?.total || 0) }} قطعه ثبت شده در فروشگاه.</p>
      </div>
      <NuxtLink to="/admin/products/new" class="btn btn-primary btn-sm">+ محصول جدید</NuxtLink>
    </div>

    <div class="toolbar panel">
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="search" class="input" type="search" placeholder="جستجوی نام یا کد فنی…" />
        <button type="submit" class="btn btn-outline btn-sm">جستجو</button>
      </form>
      <div class="toolbar-links">
        <NuxtLink to="/admin/inventory" class="tiny accent-link">انبارداری ←</NuxtLink>
        <NuxtLink to="/admin/categories" class="tiny accent-link">دسته‌بندی‌ها ←</NuxtLink>
      </div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>محصول</th>
            <th>دسته‌بندی</th>
            <th>قیمت</th>
            <th>موجودی</th>
            <th>وضعیت</th>
            <th>ویژه</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in data?.items || []" :key="p.id">
            <td>
              <div class="product-cell">
                <span class="thumb"><PartArt :kind="p.art" /></span>
                <div>
                  <NuxtLink :to="`/admin/products/${p.id}`" class="p-name">{{ p.name }}</NuxtLink>
                  <span class="mono tiny muted">{{ p.sku }}</span>
                </div>
              </div>
            </td>
            <td class="tiny muted">{{ p.category?.name }}</td>
            <td class="nowrap">{{ toman(p.price) }}</td>
            <td>
              <span class="badge" :class="p.stock === 0 ? 'badge-danger' : p.stock <= p.minStock ? 'badge-warn' : 'badge-ok'">
                {{ faNum(p.stock) }} {{ p.unit }}
              </span>
            </td>
            <td>
              <button type="button" class="toggle" :class="{ on: p.isActive }" @click="toggleField(p, 'isActive')">
                {{ p.isActive ? 'فعال' : 'غیرفعال' }}
              </button>
            </td>
            <td>
              <button type="button" class="star" :class="{ on: p.isFeatured }" :aria-label="'ویژه'" @click="toggleField(p, 'isFeatured')">★</button>
            </td>
            <td>
              <div class="row-actions">
                <NuxtLink :to="`/admin/products/${p.id}`" class="mini-btn">ویرایش</NuxtLink>
                <NuxtLink :to="`/products/${p.slug}`" target="_blank" class="mini-btn">نمایش</NuxtLink>
                <button type="button" class="mini-btn danger" @click="remove(p)">حذف</button>
              </div>
            </td>
          </tr>
          <tr v-if="!pending && !(data?.items || []).length">
            <td colspan="7" class="center muted">محصولی یافت نشد.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="data && data.pages > 1" class="pagination">
      <button type="button" class="page-btn" :disabled="page <= 1" @click="page--">قبلی</button>
      <span class="tiny muted">صفحه {{ faNum(data.page) }} از {{ faNum(data.pages) }}</span>
      <button type="button" class="page-btn" :disabled="page >= data.pages" @click="page++">بعدی</button>
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
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.search-form {
  display: flex;
  gap: 7px;
  flex: 1;
  max-width: 420px;
}

.search-form .input {
  height: 36px;
  padding: 6px 12px;
  font-size: 12.5px;
}

.toolbar-links {
  display: flex;
  gap: 14px;
}

.accent-link { color: #ff8d84; }

.product-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 220px;
}

.thumb {
  width: 42px;
  height: 36px;
  padding: 3px;
  border-radius: 7px;
  background: #0a0e13;
  border: 1px solid var(--line-soft);
  flex-shrink: 0;
}

.p-name {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.7;
}

.p-name:hover { color: #ffb4ad; }

.toggle {
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted-2);
  font-family: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

.toggle.on {
  color: #58e2a1;
  border-color: rgba(47, 208, 125, 0.35);
  background: rgba(47, 208, 125, 0.08);
}

.star {
  border: none;
  background: transparent;
  color: #3a4653;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}

.star.on { color: #ffb020; }

.row-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.mini-btn {
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  color: #c3cdd9;
  font-family: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

.mini-btn:hover { border-color: #3d4857; color: #fff; }

.mini-btn.danger { color: #ff8d9b; border-color: rgba(255, 84, 104, 0.3); }

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.page-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: #0b0f14;
  color: #c3cdd9;
  font-family: inherit;
  font-size: 11.5px;
  cursor: pointer;
}

.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
