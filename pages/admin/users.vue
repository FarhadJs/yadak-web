<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const { user: currentUser } = useAuth();
const toast = useToast();

const search = ref('');

const { data: users, refresh } = await useAsyncData(
  'admin:users',
  () => api<any[]>('/api/admin/users', { query: { search: search.value || undefined } }),
  { default: () => [] },
);

const doSearch = async () => refresh();

const changeRole = async (u: any, role: string) => {
  try {
    await api(`/api/admin/users/${u.id}/role`, { method: 'PATCH', body: { role } });
    await refresh();
    toast.push('نقش کاربر تغییر کرد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
    await refresh();
  }
};

const remove = async (u: any) => {
  if (import.meta.client && !window.confirm(`حساب «${u.name}» حذف شود؟`)) return;
  try {
    await api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    await refresh();
    toast.push('کاربر حذف شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

useHead({ title: 'مدیریت کاربران | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">اعضای سایت</span>
        <h1 class="h2">مدیریت کاربران</h1>
        <p class="muted small">{{ faNum(users.length) }} حساب کاربری ثبت شده.</p>
      </div>
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="search" class="input" type="search" placeholder="نام، ایمیل یا موبایل…" />
        <button type="submit" class="btn btn-outline btn-sm">جستجو</button>
      </form>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>کاربر</th>
            <th>موبایل</th>
            <th>نقش</th>
            <th>سفارش‌ها</th>
            <th>مجموع خرید</th>
            <th>تاریخ عضویت</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>
              <div class="user-cell">
                <span class="avatar">{{ u.name.slice(0, 1) }}</span>
                <div>
                  <strong>{{ u.name }}</strong>
                  <span class="mono tiny muted block">{{ u.email }}</span>
                </div>
              </div>
            </td>
            <td class="mono tiny">{{ u.phone || '—' }}</td>
            <td>
              <select
                class="select role-select"
                :value="u.role"
                :disabled="u.id === currentUser?.id"
                @change="changeRole(u, ($event.target as HTMLSelectElement).value)"
              >
                <option value="CUSTOMER">مشتری</option>
                <option value="ADMIN">مدیر</option>
              </select>
            </td>
            <td>{{ faNum(u.ordersCount) }}</td>
            <td class="nowrap">{{ toman(u.totalSpent) }}</td>
            <td class="tiny muted nowrap">{{ faDate(u.createdAt) }}</td>
            <td>
              <button
                type="button"
                class="mini-btn danger"
                :disabled="u.id === currentUser?.id"
                @click="remove(u)"
              >
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

.search-form {
  display: flex;
  gap: 7px;
  width: min(360px, 100%);
}

.search-form .input {
  height: 36px;
  padding: 6px 12px;
  font-size: 12.5px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 200px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(255, 59, 47, 0.14);
  color: #ffb4ad;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}

.block { display: block; }

.role-select {
  height: 32px;
  padding: 4px 10px;
  font-size: 11px;
  width: 110px;
}

.mini-btn {
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  color: #ff8d9b;
  font-family: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

.mini-btn:disabled { opacity: 0.35; cursor: not-allowed; }
</style>
