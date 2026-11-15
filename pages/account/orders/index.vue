<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' });

const { api } = useApi();

const { data: orders } = await useAsyncData('account:orders:list', () => api<any[]>('/api/orders'), {
  default: () => [],
});

const filter = ref<'all' | 'open' | 'done' | 'canceled'>('all');

const filtered = computed(() => {
  const list = orders.value || [];
  if (filter.value === 'open') return list.filter((o) => ['PENDING', 'PAID', 'SHIPPED'].includes(o.status));
  if (filter.value === 'done') return list.filter((o) => o.status === 'DELIVERED');
  if (filter.value === 'canceled') return list.filter((o) => o.status === 'CANCELED');
  return list;
});

useHead({ title: 'سفارش‌های من | یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">تاریخچه خرید</span>
        <h1 class="h2">سفارش‌های من</h1>
      </div>
      <div class="filter-tabs">
        <button type="button" :class="{ active: filter === 'all' }" @click="filter = 'all'">همه</button>
        <button type="button" :class="{ active: filter === 'open' }" @click="filter = 'open'">در جریان</button>
        <button type="button" :class="{ active: filter === 'done' }" @click="filter = 'done'">تحویل‌شده</button>
        <button type="button" :class="{ active: filter === 'canceled' }" @click="filter = 'canceled'">لغو‌شده</button>
      </div>
    </div>

    <div v-if="filtered.length" class="order-list">
      <article v-for="o in filtered" :key="o.id" class="order-card panel">
        <div class="order-head">
          <div>
            <span class="order-num mono">{{ o.orderNumber }}</span>
            <span class="order-date tiny muted">{{ faDateTime(o.createdAt) }}</span>
          </div>
          <span class="badge" :class="`badge-${statusTone(o.status)}`">{{ statusLabel(o.status) }}</span>
        </div>

        <div class="order-body">
          <div class="order-meta">
            <div>
              <span class="tiny muted">تعداد قطعات</span>
              <strong>{{ faNum(o.qtyCount) }} عدد</strong>
            </div>
            <div>
              <span class="tiny muted">روش پرداخت</span>
              <strong>{{ PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod }}</strong>
            </div>
            <div>
              <span class="tiny muted">مبلغ کل</span>
              <strong>{{ toman(o.total) }}</strong>
            </div>
          </div>

          <NuxtLink :to="`/account/orders/${o.id}`" class="btn btn-outline btn-sm">جزئیات سفارش</NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="empty panel">
      <h3>سفارشی در این بخش وجود ندارد</h3>
      <p>با خرید از فروشگاه، سفارش‌های شما اینجا نمایش داده می‌شود.</p>
      <NuxtLink to="/products" class="btn btn-primary btn-sm">مشاهده قطعات</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
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

.order-list {
  display: grid;
  gap: 10px;
}

.order-card {
  padding: 16px;
}

.order-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}

.order-num {
  font-size: 13px;
  font-weight: 700;
  margin-left: 10px;
}

.order-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  flex-wrap: wrap;
}

.order-meta {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.order-meta div {
  display: grid;
  gap: 2px;
}

.order-meta strong {
  font-size: 13px;
}

@media (max-width: 620px) {
  .order-meta { gap: 16px; }
}
</style>
