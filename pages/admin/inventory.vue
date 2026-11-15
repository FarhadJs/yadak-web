<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const { data, refresh } = await useAsyncData('admin:inventory', () => api<any>('/api/admin/inventory'), {
  default: () => ({ items: [], summary: {} }),
});

const filter = ref<'all' | 'low' | 'out'>('all');
const drafts = reactive<Record<string, number>>({});
const savingId = ref<string | null>(null);

const items = computed(() => {
  const list = data.value?.items || [];
  if (filter.value === 'low') return list.filter((i: any) => i.status !== 'OK');
  if (filter.value === 'out') return list.filter((i: any) => i.status === 'OUT');
  return list;
});

const saveStock = async (item: any) => {
  const value = Number(drafts[item.id]);
  if (!Number.isFinite(value) || value < 0) {
    toast.push('مقدار موجودی باید عددی بزرگ‌تر از صفر باشد.', 'warn');
    return;
  }
  savingId.value = item.id;
  try {
    await api(`/api/admin/products/${item.id}/stock`, { method: 'PATCH', body: { stock: value } });
    delete drafts[item.id];
    await refresh();
    toast.push('موجودی انبار به‌روزرسانی شد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    savingId.value = null;
  }
};

useHead({ title: 'انبارداری | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">کنترل موجودی</span>
        <h1 class="h2">انبارداری</h1>
        <p class="muted small">موجودی هر قطعه را مستقیم از این صفحه اصلاح کنید.</p>
      </div>
    </div>

    <div class="inv-stats">
      <div class="inv-stat">
        <span>کل اقلام</span>
        <strong>{{ faNum(data?.summary?.totalItems || 0) }}</strong>
      </div>
      <div class="inv-stat warn">
        <span>موجودی کم</span>
        <strong>{{ faNum(data?.summary?.lowStock || 0) }}</strong>
      </div>
      <div class="inv-stat danger">
        <span>ناموجود</span>
        <strong>{{ faNum(data?.summary?.outOfStock || 0) }}</strong>
      </div>
      <div class="inv-stat ok">
        <span>ارزش انبار</span>
        <strong>{{ toman(data?.summary?.inventoryValue || 0) }}</strong>
      </div>
    </div>

    <div class="toolbar">
      <div class="filter-tabs">
        <button type="button" :class="{ active: filter === 'all' }" @click="filter = 'all'">همه</button>
        <button type="button" :class="{ active: filter === 'low' }" @click="filter = 'low'">کم‌موجود</button>
        <button type="button" :class="{ active: filter === 'out' }" @click="filter = 'out'">ناموجود</button>
      </div>
      <span class="tiny muted">{{ faNum(items.length) }} ردیف</span>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>قطعه</th>
            <th>دسته</th>
            <th>موجودی فعلی</th>
            <th>حد هشدار</th>
            <th>موجودی جدید</th>
            <th>ارزش</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <div class="cell-name">
                <strong>{{ item.name }}</strong>
                <span class="mono tiny muted">{{ item.sku }}</span>
              </div>
            </td>
            <td class="tiny muted">{{ item.category }}</td>
            <td>
              <span class="badge" :class="item.status === 'OUT' ? 'badge-danger' : item.status === 'LOW' ? 'badge-warn' : 'badge-ok'">
                {{ faNum(item.stock) }} {{ item.unit }}
              </span>
            </td>
            <td class="tiny muted">{{ faNum(item.minStock) }}</td>
            <td>
              <div class="stock-edit">
                <input
                  v-model.number="drafts[item.id]"
                  class="input"
                  type="number"
                  min="0"
                  :placeholder="String(item.stock)"
                  :aria-label="`موجودی جدید ${item.name}`"
                />
                <button
                  type="button"
                  class="btn btn-outline btn-sm"
                  :disabled="drafts[item.id] === undefined || savingId === item.id"
                  @click="saveStock(item)"
                >
                  {{ savingId === item.id ? '…' : 'ثبت' }}
                </button>
              </div>
            </td>
            <td class="tiny">{{ toman(item.inventoryValue) }}</td>
            <td>
              <NuxtLink :to="`/admin/products/${item.id}`" class="tiny accent-link">ویرایش</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 14px; }

.inv-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.inv-stat {
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--panel);
  display: grid;
  gap: 2px;
}

.inv-stat span { font-size: 10.5px; color: var(--muted-2); }
.inv-stat strong { font-size: 18px; font-weight: 900; }

.inv-stat.warn strong { color: #ffc55c; }
.inv-stat.danger strong { color: #ff8d9b; }
.inv-stat.ok strong { color: #58e2a1; }

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #0b0f14;
}

.filter-tabs button {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 11.5px;
  cursor: pointer;
}

.filter-tabs button.active {
  background: rgba(255, 59, 47, 0.14);
  color: #ffb4ad;
}

.cell-name {
  display: grid;
  gap: 1px;
  min-width: 190px;
}

.cell-name strong { font-size: 12px; font-weight: 600; }

.stock-edit {
  display: flex;
  gap: 5px;
  align-items: center;
}

.stock-edit .input {
  width: 84px;
  height: 32px;
  padding: 4px 9px;
  font-size: 12px;
  font-family: var(--mono);
}

.stock-edit .btn { height: 32px; padding: 0 10px; font-size: 11px; }

.accent-link { color: #ff8d84; }

@media (max-width: 1000px) {
  .inv-stats { grid-template-columns: 1fr 1fr; }
}
</style>
