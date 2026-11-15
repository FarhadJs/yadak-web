<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' });

const { api } = useApi();
const { user } = useAuth();
const cart = useCart();
const wishlist = useWishlist();

const { data: orders } = await useAsyncData('account:orders', () => api<any[]>('/api/orders'), {
  default: () => [],
});
await wishlist.load();
await cart.load();

const spent = computed(() =>
  (orders.value || [])
    .filter((o: any) => o.status !== 'CANCELED')
    .reduce((s: number, o: any) => s + o.total, 0),
);

const pending = computed(
  () => (orders.value || []).filter((o: any) => ['PENDING', 'PAID', 'SHIPPED'].includes(o.status)).length,
);

useHead({ title: 'داشبورد کاربری | یدک سیستم' });
</script>

<template>
  <div class="account-page">
    <div class="page-head">
      <div>
        <span class="eyebrow">حساب من</span>
        <h1 class="h2">داشبورد کاربری</h1>
        <p class="muted small">
          {{ user?.name }} — خوش آمدید. سفارش‌ها و علاقه‌مندی‌های شما در یک نگاه.
        </p>
      </div>
      <NuxtLink to="/products" class="btn btn-primary btn-sm">خرید قطعه جدید</NuxtLink>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-icon red">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10" stroke-linejoin="round" />
          </svg>
        </span>
        <div>
          <strong>{{ faNum(orders?.length || 0) }}</strong>
          <span>کل سفارش‌ها</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon gold">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </span>
        <div>
          <strong>{{ faNum(wishlist.ids.value.length) }}</strong>
          <span>قطعه در علاقه‌مندی</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon blue">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" stroke-linecap="round" />
          </svg>
        </span>
        <div>
          <strong>{{ faNum(cart.count.value) }}</strong>
          <span>قطعه در سبد خرید</span>
        </div>
      </div>

      <div class="stat-card">
        <span class="stat-icon green">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" />
          </svg>
        </span>
        <div>
          <strong>{{ faNum(pending) }}</strong>
          <span>سفارش در جریان</span>
        </div>
      </div>
    </div>

    <div class="account-grid">
      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">آخرین سفارش‌ها</span>
          <NuxtLink to="/account/orders" class="tiny accent-link">همه سفارش‌ها ←</NuxtLink>
        </div>

        <div v-if="orders?.length" class="table-wrap plain">
          <table class="table">
            <thead>
              <tr>
                <th>شماره سفارش</th>
                <th>تاریخ</th>
                <th>مبلغ</th>
                <th>وضعیت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders.slice(0, 5)" :key="o.id">
                <td class="num">{{ o.orderNumber }}</td>
                <td class="tiny muted">{{ faDate(o.createdAt) }}</td>
                <td>{{ toman(o.total) }}</td>
                <td><span class="badge" :class="`badge-${statusTone(o.status)}`">{{ statusLabel(o.status) }}</span></td>
                <td><NuxtLink :to="`/account/orders/${o.id}`" class="tiny accent-link">جزئیات</NuxtLink></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="empty">
          <h3>هنوز سفارشی ثبت نکرده‌اید</h3>
          <NuxtLink to="/products" class="btn btn-primary btn-sm">شروع خرید</NuxtLink>
        </div>
      </section>

      <aside class="side-col">
        <div class="panel panel-pad summary-box">
          <span class="tiny muted">مجموع خرید (بدون سفارش‌های لغوشده)</span>
          <strong class="big-price">{{ toman(spent) }}</strong>
          <div class="divider" />
          <ul class="quick-list">
            <li><NuxtLink to="/account/orders">پیگیری سفارش‌ها ←</NuxtLink></li>
            <li><NuxtLink to="/account/wishlist">مشاهده علاقه‌مندی‌ها ←</NuxtLink></li>
            <li><NuxtLink to="/account/profile">ویرایش اطلاعات حساب ←</NuxtLink></li>
            <li><NuxtLink to="/contact">درخواست مشاوره فنی ←</NuxtLink></li>
          </ul>
        </div>

        <div class="panel panel-pad help-box">
          <strong>پشتیبانی نمایندگی</strong>
          <p class="tiny muted">برای استعلام قطعه یا پیگیری سفارش، مستقیم تماس بگیرید.</p>
          <a href="tel:03538226600" class="mono help-phone">۰۳۵-۳۸۲۲۶۶۰۰</a>
        </div>
      </aside>
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

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}

.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-icon.red { background: rgba(255, 59, 47, 0.12); color: #ff8d84; }
.stat-icon.gold { background: rgba(255, 176, 32, 0.12); color: #ffc55c; }
.stat-icon.blue { background: rgba(74, 168, 255, 0.12); color: #7cc0ff; }
.stat-icon.green { background: rgba(47, 208, 125, 0.12); color: #58e2a1; }

.stat-card strong {
  display: block;
  font-size: 19px;
  font-weight: 900;
  line-height: 1.4;
}

.stat-card span {
  font-size: 10.5px;
  color: var(--muted-2);
}

.account-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 14px;
  align-items: start;
}

.table-wrap.plain {
  border: none;
  border-radius: 0;
}

.accent-link {
  color: #ff8d84;
}

.side-col {
  display: grid;
  gap: 12px;
}

.big-price {
  display: block;
  font-size: 21px;
  font-weight: 900;
  margin-top: 4px;
}

.quick-list {
  display: grid;
  gap: 8px;
  font-size: 12px;
}

.quick-list a {
  color: #b9c4d1;
}

.quick-list a:hover {
  color: #fff;
}

.help-box p {
  margin: 5px 0 8px;
  line-height: 1.9;
}

.help-phone {
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 1000px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .account-grid { grid-template-columns: 1fr; }
}
</style>
