<script setup lang="ts">
const route = useRoute();
const { user, fetchMe, logout, isAdmin } = useAuth();
const cart = useCart();

if (!user.value) await fetchMe();

const sidebarOpen = ref(false);

const icons: Record<string, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  orders: 'M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z',
  cart: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6M9.5 20h.01M18 20h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  box: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  chat: 'M4 5h16v11H8l-4 4zM8 10h8M8 13h4',
  seo: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M8 11h6M11 8v6',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
};

const customerNav = [
  { to: '/account', label: 'داشبورد', icon: 'dashboard' },
  { to: '/account/orders', label: 'سفارش‌های من', icon: 'orders' },
  { to: '/account/wishlist', label: 'علاقه‌مندی‌ها', icon: 'heart' },
  { to: '/cart', label: 'سبد خرید', icon: 'cart' },
  { to: '/account/profile', label: 'اطلاعات حساب', icon: 'user' },
];

const adminNav = [
  { to: '/admin', label: 'نمای کلی', icon: 'dashboard' },
  { to: '/admin/products', label: 'مدیریت محصولات', icon: 'box' },
  { to: '/admin/inventory', label: 'انبارداری', icon: 'layers' },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: 'list' },
  { to: '/admin/orders', label: 'سفارش‌ها', icon: 'orders' },
  { to: '/admin/users', label: 'کاربران', icon: 'users' },
  { to: '/admin/messages', label: 'پیام‌ها', icon: 'chat' },
  { to: '/admin/branches', label: 'شعب نمایندگی', icon: 'pin' },
  { to: '/admin/seo', label: 'مدیریت سئو', icon: 'seo' },
];

const nav = computed(() => (route.path.startsWith('/admin') ? adminNav : customerNav));
const isActive = (path: string) =>
  path === '/account' || path === '/admin' ? route.path === path : route.path.startsWith(path);

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);

const today = new Intl.DateTimeFormat('fa-IR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());
</script>

<template>
  <div class="dash">
    <aside class="dash-side" :class="{ open: sidebarOpen }">
      <NuxtLink to="/" class="dash-brand">
        <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#ff3b2f" stroke-width="3" />
          <circle cx="24" cy="24" r="7" fill="#ff3b2f" />
          <path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#ffb020" stroke-width="3" stroke-linecap="round" />
        </svg>
        <span>
          <strong>یدک سیستم</strong>
          <small>{{ route.path.startsWith('/admin') ? 'پنل مدیریت' : 'پنل کاربری' }}</small>
        </span>
      </NuxtLink>

      <nav class="dash-nav">
        <span class="dash-nav-label">
          {{ route.path.startsWith('/admin') ? 'مدیریت فروشگاه' : 'حساب من' }}
        </span>
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="dash-link"
          :class="{ active: isActive(item.to) }"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">
            <path :d="icons[item.icon]" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ item.label }}</span>
        </NuxtLink>

        <template v-if="route.path.startsWith('/account') && isAdmin">
          <span class="dash-nav-label">مدیریت</span>
          <NuxtLink to="/admin" class="dash-link admin-link">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">
              <path :d="icons.dashboard" stroke-linejoin="round" />
            </svg>
            <span>پنل مدیریت سایت</span>
          </NuxtLink>
        </template>

        <template v-if="route.path.startsWith('/admin')">
          <span class="dash-nav-label">سایر</span>
          <NuxtLink to="/account" class="dash-link">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">
              <path :d="icons.user" stroke-linecap="round" />
            </svg>
            <span>نمای کاربری سایت</span>
          </NuxtLink>
        </template>
      </nav>

      <div class="dash-side-foot">
        <NuxtLink to="/" class="dash-link">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M15 6l-6 6 6 6" stroke-linecap="round" />
          </svg>
          <span>بازگشت به فروشگاه</span>
        </NuxtLink>
        <button type="button" class="dash-link logout" @click="logout">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>خروج از حساب</span>
        </button>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="dash-overlay" @click="sidebarOpen = false" />

    <div class="dash-main">
      <header class="dash-top">
        <div class="dash-top-left">
          <button type="button" class="dash-burger" aria-label="منو" @click="sidebarOpen = true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
            </svg>
          </button>
          <div class="dash-welcome">
            <span class="tiny muted">{{ today }}</span>
            <strong>سلام {{ user?.name?.split(' ')[0] || 'کاربر' }} 👋</strong>
          </div>
        </div>

        <div class="dash-top-right">
          <NuxtLink to="/cart" class="dash-icon-btn" aria-label="سبد خرید">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7">
              <path :d="icons.cart" stroke-linecap="round" />
            </svg>
            <span v-if="cart.count.value" class="dash-badge">{{ faNum(cart.count.value) }}</span>
          </NuxtLink>

          <div class="dash-user">
            <span class="dash-avatar">{{ user?.name?.slice(0, 1) || '?' }}</span>
            <span class="dash-user-info">
              <strong>{{ user?.name }}</strong>
              <small>{{ user?.role === 'ADMIN' ? 'مدیر سایت' : 'مشتری' }}</small>
            </span>
          </div>
        </div>
      </header>

      <div class="dash-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash {
  min-height: 100vh;
  display: flex;
  background: #07090c;
}

.dash-side {
  width: 246px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #090c10;
  border-left: 1px solid var(--line);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 80;
}

.dash-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--line-soft);
}

.dash-brand span {
  display: grid;
  line-height: 1.5;
}

.dash-brand strong {
  font-size: 15px;
  font-weight: 900;
}

.dash-brand small {
  font-size: 10px;
  color: var(--accent);
}

.dash-nav {
  display: grid;
  gap: 2px;
  padding: 14px 10px;
  align-content: start;
  flex: 1;
}

.dash-nav-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--muted-2);
  padding: 12px 10px 6px;
}

.dash-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  border-radius: 8px;
  color: #a6b2c0;
  font-size: 12.5px;
  border: none;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  text-align: right;
}

.dash-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.dash-link.active {
  background: rgba(255, 59, 47, 0.12);
  color: #fff;
  box-shadow: inset 2px 0 0 var(--accent);
}

.dash-link.admin-link {
  color: #ffc55c;
}

.dash-side-foot {
  padding: 10px;
  border-top: 1px solid var(--line-soft);
  display: grid;
  gap: 2px;
}

.dash-link.logout {
  color: #ff8d9b;
}

.dash-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dash-top {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 22px;
  min-height: 64px;
  background: rgba(7, 9, 12, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.dash-top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dash-welcome {
  display: grid;
  line-height: 1.6;
}

.dash-welcome strong {
  font-size: 14px;
  font-weight: 800;
}

.dash-burger {
  display: none;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.dash-top-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dash-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  border: 1px solid var(--line);
  color: #d3dce5;
}

.dash-badge {
  position: absolute;
  top: -5px;
  left: -5px;
  min-width: 17px;
  height: 17px;
  border-radius: 9px;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  display: grid;
  place-items: center;
  padding: 0 4px;
}

.dash-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-inline-start: 12px;
  border-inline-start: 1px solid var(--line-soft);
}

.dash-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ff5a3c, #b81b15);
  font-weight: 800;
  font-size: 14px;
}

.dash-user-info {
  display: grid;
  line-height: 1.5;
}

.dash-user-info strong {
  font-size: 12px;
}

.dash-user-info small {
  font-size: 10px;
  color: var(--muted-2);
}

.dash-content {
  padding: 22px;
  flex: 1;
}

.dash-overlay {
  display: none;
}

@media (max-width: 900px) {
  .dash-side {
    position: fixed;
    inset-block: 0;
    right: 0;
    transform: translateX(100%);
    transition: transform 0.24s ease;
    width: 260px;
  }
  .dash-side.open { transform: translateX(0); }
  .dash-burger { display: grid; }
  .dash-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 70;
  }
  .dash-content { padding: 14px; }
  .dash-top { padding: 10px 14px; }
  .dash-user-info { display: none; }
}
</style>
