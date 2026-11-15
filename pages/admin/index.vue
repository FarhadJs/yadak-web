<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();

const { data: stats } = await useAsyncData('admin:stats', () => api<any>('/api/admin/stats'));

const maxSeries = computed(() =>
  Math.max(1, ...((stats.value?.series || []).map((s: any) => s.total) as number[])),
);

const statusOrder = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'];
const statusRows = computed(() =>
  statusOrder.map((key) => ({
    key,
    label: statusLabel(key),
    tone: statusTone(key),
    count: stats.value?.statusBreakdown?.[key] || 0,
  })),
);
const totalStatus = computed(() => statusRows.value.reduce((s, r) => s + r.count, 0) || 1);

useHead({ title: 'داشبورد مدیریت | یدک سیستم' });
</script>

<template>
  <div v-if="stats" class="admin-home">
    <div class="page-head">
      <div>
        <span class="eyebrow">پنل مدیریت</span>
        <h1 class="h2">نمای کلی فروشگاه</h1>
        <p class="muted small">وضعیت فروش، انبار و سفارش‌های یدک سیستم.</p>
      </div>
      <div class="row">
        <NuxtLink to="/admin/products/new" class="btn btn-primary btn-sm">+ محصول جدید</NuxtLink>
        <NuxtLink to="/" target="_blank" class="btn btn-outline btn-sm">مشاهده سایت</NuxtLink>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-top">
          <span>درآمد کل</span>
          <span class="badge badge-ok">{{ faNum(stats.totals.todayOrders) }} سفارش امروز</span>
        </div>
        <strong>{{ toman(stats.totals.revenue) }}</strong>
        <span class="kpi-sub">امروز: {{ toman(stats.totals.todayRevenue) }}</span>
      </div>
      <div class="kpi">
        <div class="kpi-top">
          <span>سفارش‌ها</span>
          <span class="badge badge-warn">{{ faNum(stats.totals.pendingOrders) }} در انتظار</span>
        </div>
        <strong>{{ faNum(stats.totals.orders) }}</strong>
        <span class="kpi-sub">میانگین سفارش: {{ toman(stats.totals.orders ? stats.totals.revenue / stats.totals.orders : 0) }}</span>
      </div>
      <div class="kpi">
        <div class="kpi-top">
          <span>مشتریان</span>
          <NuxtLink to="/admin/users" class="kpi-link">مدیریت ←</NuxtLink>
        </div>
        <strong>{{ faNum(stats.totals.customers) }}</strong>
        <span class="kpi-sub">حساب کاربری فعال</span>
      </div>
      <div class="kpi">
        <div class="kpi-top">
          <span>محصولات</span>
          <NuxtLink to="/admin/inventory" class="kpi-link">انبار ←</NuxtLink>
        </div>
        <strong>{{ faNum(stats.totals.products) }}</strong>
        <span class="kpi-sub">{{ faNum(stats.lowStock.length) }} قطعه نیازمند تأمین</span>
      </div>
    </div>

    <div class="main-grid">
      <section class="panel chart-panel">
        <div class="panel-head">
          <span class="panel-title">فروش ۷ روز اخیر</span>
          <span class="tiny muted">مجموع: {{ toman(stats.series.reduce((s: number, d: any) => s + d.total, 0)) }}</span>
        </div>
        <div class="chart">
          <div v-for="day in stats.series" :key="day.date" class="bar-col">
            <span class="bar-value">{{ day.total ? (day.total / 1_000_000).toFixed(1) + 'M' : '' }}</span>
            <div class="bar-track">
              <div class="bar" :style="{ height: Math.max(4, (day.total / maxSeries) * 100) + '%' }" />
            </div>
            <span class="bar-label">{{ day.label }}</span>
            <span class="bar-count">{{ faNum(day.count) }}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">وضعیت سفارش‌ها</span>
        </div>
        <div class="status-list">
          <div v-for="row in statusRows" :key="row.key" class="status-row">
            <div class="status-top">
              <span class="badge" :class="`badge-${row.tone}`">{{ row.label }}</span>
              <span class="tiny">{{ faNum(row.count) }}</span>
            </div>
            <div class="status-bar">
              <span :class="`tone-${row.tone}`" :style="{ width: (row.count / totalStatus) * 100 + '%' }" />
            </div>
          </div>
        </div>

        <div class="panel-head sub">
          <span class="panel-title">پرفروش‌ترین قطعات</span>
        </div>
        <ul class="top-list">
          <li v-for="(p, i) in stats.topProducts" :key="p.sku">
            <span class="top-rank mono">{{ faNum(i + 1) }}</span>
            <span class="top-name">{{ p.name }}</span>
            <span class="top-qty">{{ faNum(p.qty) }} عدد</span>
          </li>
          <li v-if="!stats.topProducts.length" class="tiny muted">هنوز فروشی ثبت نشده است.</li>
        </ul>
      </section>
    </div>

    <div class="bottom-grid">
      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">آخرین سفارش‌ها</span>
          <NuxtLink to="/admin/orders" class="tiny accent-link">همه سفارش‌ها ←</NuxtLink>
        </div>
        <div class="table-wrap plain">
          <table class="table">
            <thead>
              <tr>
                <th>شماره</th>
                <th>مشتری</th>
                <th>مبلغ</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in stats.recentOrders" :key="o.id">
                <td class="num">{{ o.orderNumber }}</td>
                <td>{{ o.customerName }}</td>
                <td>{{ toman(o.total) }}</td>
                <td><span class="badge" :class="`badge-${statusTone(o.status)}`">{{ statusLabel(o.status) }}</span></td>
                <td class="tiny muted">{{ faDate(o.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">هشدار موجودی</span>
          <NuxtLink to="/admin/inventory" class="tiny accent-link">انبارداری ←</NuxtLink>
        </div>
        <ul class="low-list">
          <li v-for="item in stats.lowStock" :key="item.id">
            <div>
              <strong>{{ item.name }}</strong>
              <span class="mono tiny muted">{{ item.sku }}</span>
            </div>
            <span class="badge" :class="item.stock === 0 ? 'badge-danger' : 'badge-warn'">
              {{ item.stock === 0 ? 'ناموجود' : `${faNum(item.stock)} عدد` }}
            </span>
          </li>
          <li v-if="!stats.lowStock.length" class="tiny muted">همه قطعات موجودی کافی دارند.</li>
        </ul>
      </section>
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
  margin-bottom: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.kpi {
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.025), transparent), var(--panel);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 6px;
}

.kpi strong {
  font-size: 20px;
  font-weight: 900;
  line-height: 1.4;
}

.kpi-sub {
  display: block;
  font-size: 10.5px;
  color: var(--muted-2);
  margin-top: 2px;
}

.kpi-link {
  color: #ff8d84;
  font-size: 10px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  height: 220px;
  padding: 16px 18px 12px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  height: 100%;
  justify-content: flex-end;
}

.bar-value {
  font-size: 9.5px;
  color: var(--muted-2);
  font-family: var(--mono);
}

.bar-track {
  flex: 1;
  width: 100%;
  max-width: 38px;
  display: flex;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.025);
  border-radius: 5px;
  overflow: hidden;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #ff5a3c, rgba(255, 59, 47, 0.35));
  border-radius: 5px 5px 0 0;
  transition: height 0.4s ease;
}

.bar-label {
  font-size: 10px;
  color: var(--muted);
}

.bar-count {
  font-size: 9.5px;
  color: var(--muted-2);
}

.status-list {
  display: grid;
  gap: 9px;
  padding: 14px 18px;
}

.status-row {
  display: grid;
  gap: 4px;
}

.status-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-bar {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.status-bar span {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: var(--info);
}

.status-bar .tone-ok { background: var(--ok); }
.status-bar .tone-warn { background: var(--accent-2); }
.status-bar .tone-danger { background: var(--danger); }

.panel-head.sub {
  border-top: 1px solid var(--line-soft);
}

.top-list {
  display: grid;
  padding: 6px 18px 14px;
}

.top-list li {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line-soft);
  font-size: 11.5px;
}

.top-list li:last-child { border-bottom: none; }

.top-rank {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 10px;
  color: var(--muted);
}

.top-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-qty {
  font-size: 10.5px;
  color: var(--muted-2);
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 12px;
}

.table-wrap.plain {
  border: none;
}

.low-list {
  display: grid;
  padding: 6px 18px 14px;
}

.low-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line-soft);
}

.low-list li:last-child { border-bottom: none; }

.low-list strong {
  display: block;
  font-size: 11.5px;
  line-height: 1.7;
}

.accent-link { color: #ff8d84; }

@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .main-grid, .bottom-grid { grid-template-columns: 1fr; }
}
</style>
