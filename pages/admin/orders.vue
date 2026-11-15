<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const search = ref('');
const status = ref('');
const page = ref(1);

const { data, pending, refresh } = await useAsyncData(
  'admin:orders',
  () =>
    api<any>('/api/admin/orders', {
      query: {
        search: search.value || undefined,
        status: status.value || undefined,
        page: page.value,
        limit: 15,
      },
    }),
  { watch: [status, page] },
);

const applySearch = async () => {
  page.value = 1;
  await refresh();
};

const statuses = [
  ['PENDING', 'در انتظار پرداخت'],
  ['PAID', 'پرداخت‌شده'],
  ['SHIPPED', 'ارسال‌شده'],
  ['DELIVERED', 'تحویل‌شده'],
  ['CANCELED', 'لغو‌شده'],
];

const changeStatus = async (order: any, value: string) => {
  try {
    await api(`/api/admin/orders/${order.id}/status`, { method: 'PATCH', body: { status: value } });
    await refresh();
    toast.push('وضعیت سفارش به‌روزرسانی شد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

useHead({ title: 'سفارش‌ها | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">فروش و ارسال</span>
        <h1 class="h2">سفارش‌ها</h1>
        <p class="muted small">{{ faNum(data?.total || 0) }} سفارش ثبت شده.</p>
      </div>
    </div>

    <div class="toolbar panel">
      <form class="search-form" @submit.prevent="applySearch">
        <input v-model="search" class="input" type="search" placeholder="شماره سفارش، نام یا موبایل…" />
        <button type="submit" class="btn btn-outline btn-sm">جستجو</button>
      </form>
      <select v-model="status" class="select status-filter" aria-label="فیلتر وضعیت">
        <option value="">همه وضعیت‌ها</option>
        <option v-for="[value, label] in statuses" :key="value" :value="value">{{ label }}</option>
      </select>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>شماره سفارش</th>
            <th>مشتری</th>
            <th>شهر</th>
            <th>اقلام</th>
            <th>مبلغ</th>
            <th>پرداخت</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in data?.items || []" :key="o.id">
            <td class="num">{{ o.orderNumber }}</td>
            <td>
              <strong class="cust-name">{{ o.customerName }}</strong>
              <span class="mono tiny muted block">{{ o.phone }}</span>
            </td>
            <td class="tiny muted">{{ o.city }}</td>
            <td class="tiny">{{ faNum(o.itemCount) }} قلم</td>
            <td class="nowrap">{{ toman(o.total) }}</td>
            <td class="tiny muted">{{ PAYMENT_LABEL[o.paymentMethod] }}</td>
            <td class="tiny muted nowrap">{{ faDate(o.createdAt) }}</td>
            <td>
              <select class="select row-select" :value="o.status" @change="changeStatus(o, ($event.target as HTMLSelectElement).value)">
                <option v-for="[value, label] in statuses" :key="value" :value="value">{{ label }}</option>
              </select>
            </td>
          </tr>
          <tr v-if="!pending && !(data?.items || []).length">
            <td colspan="8" class="center muted">سفارشی با این مشخصات یافت نشد.</td>
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
.page-head { margin-bottom: 14px; }

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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

.status-filter {
  width: 170px;
  height: 36px;
  padding: 6px 12px;
  font-size: 12px;
}

.cust-name { font-size: 12px; font-weight: 600; }

.block { display: block; }

.row-select {
  height: 32px;
  padding: 4px 10px;
  font-size: 11px;
  width: 140px;
}

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
