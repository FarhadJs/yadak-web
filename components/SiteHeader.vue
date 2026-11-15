<script setup lang="ts">
const { user, isAdmin, logout } = useAuth();
const cart = useCart();
const wishlist = useWishlist();
const { api } = useApi();
const route = useRoute();

const search = ref('');
const mobileOpen = ref(false);

const { data: categories } = await useAsyncData('nav:categories', () => api<any[]>('/api/categories'), {
  default: () => [],
});
const { data: models } = await useAsyncData('nav:models', () => api<any[]>('/api/models'), {
  default: () => [],
});

const navLinks = [
  { label: 'خانه', to: '/' },
  { label: 'فروشگاه قطعات', to: '/products' },
  { label: 'شعب نمایندگی', to: '/branches' },
  { label: 'ارتباط با ما', to: '/contact' },
];

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path);

const submitSearch = async () => {
  mobileOpen.value = false;
  await navigateTo({ path: '/products', query: search.value.trim() ? { search: search.value.trim() } : {} });
};

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);
</script>

<template>
  <header class="site-header">
    <div class="topbar">
      <div class="container topbar-inner">
        <span class="topbar-item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          یزد، بلوار جمهوری اسلامی — نمایندگی رسمی MVM
        </span>
        <div class="topbar-links">
          <span class="topbar-item hide-sm">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            شنبه تا پنجشنبه ۸ تا ۲۰
          </span>
          <a href="tel:03538226600" class="topbar-phone">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            ۰۳۵-۳۸۲۲۶۶۰۰
          </a>
        </div>
      </div>
    </div>

    <div class="navbar">
      <div class="container navbar-inner">
        <NuxtLink to="/" class="brand" aria-label="یدک سیستم — نمایندگی MVM فلاحی در یزد">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="38" height="38" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#ff3b2f" stroke-width="3" />
              <circle cx="24" cy="24" r="7" fill="#ff3b2f" />
              <path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#ffb020" stroke-width="3" stroke-linecap="round" />
              <path d="M24 17l6 7-6 7-6-7z" stroke="#fff" stroke-width="2" opacity="0.9" />
            </svg>
          </span>
          <span class="brand-text">
            <strong>یدک سیستم</strong>
            <small>نمایندگی MVM فلاحی — یزد</small>
          </span>
        </NuxtLink>

        <form class="search" role="search" @submit.prevent="submitSearch">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
          </svg>
          <input
            v-model="search"
            type="search"
            class="search-input"
            placeholder="جستجوی قطعه، کد فنی یا مدل خودرو…"
            aria-label="جستجوی قطعه"
          />
          <button type="submit" class="search-btn">جستجو</button>
        </form>

        <div class="actions">
          <NuxtLink
            v-if="!user"
            to="/login"
            class="action-link login-link"
            aria-label="ورود و ثبت‌نام"
          >
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round" />
            </svg>
            <span>ورود / ثبت‌نام</span>
          </NuxtLink>

          <details v-else class="usermenu">
            <summary class="action-link" aria-label="حساب کاربری">
              <span class="avatar">{{ user.name.slice(0, 1) }}</span>
              <span class="user-name">{{ user.name.split(' ')[0] }}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6" stroke-linecap="round" />
              </svg>
            </summary>
            <div class="usermenu-panel">
              <div class="usermenu-head">
                <strong>{{ user.name }}</strong>
                <span class="tiny muted">{{ user.email }}</span>
              </div>
              <NuxtLink to="/account" class="usermenu-item">داشبورد کاربری</NuxtLink>
              <NuxtLink to="/account/orders" class="usermenu-item">سفارش‌های من</NuxtLink>
              <NuxtLink to="/account/wishlist" class="usermenu-item">علاقه‌مندی‌ها</NuxtLink>
              <NuxtLink v-if="isAdmin" to="/admin" class="usermenu-item admin">پنل مدیریت سایت</NuxtLink>
              <button type="button" class="usermenu-item danger" @click="logout">خروج از حساب</button>
            </div>
          </details>

          <NuxtLink to="/account/wishlist" class="action-link icon-only" aria-label="علاقه‌مندی‌ها">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span v-if="wishlist.ids.value.length" class="count-badge">{{ faNum(wishlist.ids.value.length) }}</span>
          </NuxtLink>

          <NuxtLink to="/cart" class="cart-link" aria-label="سبد خرید">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" stroke-linecap="round" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            <span class="cart-text">سبد خرید</span>
            <span v-if="cart.count.value" class="cart-count">{{ faNum(cart.count.value) }}</span>
          </NuxtLink>

          <button
            type="button"
            class="burger"
            aria-label="منوی موبایل"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = !mobileOpen"
          >
            <svg v-if="!mobileOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div class="container navrow">
        <nav class="nav" aria-label="ناوبری اصلی">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ active: isActive(link.to) }"
          >
            {{ link.label }}
          </NuxtLink>

          <details class="mega">
            <summary class="nav-link mega-btn">
              دسته‌بندی قطعات
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6" stroke-linecap="round" />
              </svg>
            </summary>
            <div class="mega-panel">
              <div class="mega-col">
                <span class="mega-title">دسته‌بندی‌ها</span>
                <div class="mega-grid">
                  <NuxtLink
                    v-for="cat in categories"
                    :key="cat.id"
                    :to="`/category/${cat.slug}`"
                    class="mega-link"
                  >
                    <span>{{ cat.name }}</span>
                    <span class="mega-count">{{ faNum(cat.productCount) }}</span>
                  </NuxtLink>
                </div>
              </div>
              <div class="mega-col side">
                <span class="mega-title">بر اساس خودرو</span>
                <div class="mega-models">
                  <NuxtLink
                    v-for="m in models"
                    :key="m.id"
                    :to="`/products?model=${m.slug}`"
                    class="model-chip"
                  >
                    {{ m.name }}
                  </NuxtLink>
                </div>
                <NuxtLink to="/products" class="mega-all">مشاهده همه قطعات ←</NuxtLink>
              </div>
            </div>
          </details>
        </nav>

        <span class="nav-note">
          <span class="pulse" /> ارسال سریع به سراسر ایران
        </span>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="mobileOpen" class="mobile-panel">
        <form class="search mobile-search" role="search" @submit.prevent="submitSearch">
          <input
            v-model="search"
            type="search"
            class="search-input"
            placeholder="جستجوی قطعه یا کد فنی…"
            aria-label="جستجوی قطعه"
          />
          <button type="submit" class="search-btn">جستجو</button>
        </form>

        <nav class="mobile-nav">
          <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" class="mobile-link">
            {{ link.label }}
          </NuxtLink>
          <NuxtLink v-if="isAdmin" to="/admin" class="mobile-link accent">پنل مدیریت</NuxtLink>
          <NuxtLink v-else-if="user" to="/account" class="mobile-link accent">داشبورد کاربری</NuxtLink>
          <NuxtLink v-else to="/login" class="mobile-link accent">ورود / ثبت‌نام</NuxtLink>
        </nav>

        <div class="mobile-cats">
          <span class="mega-title">دسته‌بندی‌ها</span>
          <div class="mega-models">
            <NuxtLink v-for="cat in categories" :key="cat.id" :to="`/category/${cat.slug}`" class="model-chip">
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>

        <a href="tel:03538226600" class="mobile-phone">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
          </svg>
          تماس با نمایندگی: ۰۳۵-۳۸۲۲۶۶۰۰
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: rgba(7, 9, 12, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line-soft);
}

.topbar {
  background: #05070a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 11.5px;
  color: var(--muted);
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 34px;
}

.topbar-item,
.topbar-phone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.topbar-phone {
  color: #e9eef4;
  font-weight: 700;
}

.topbar-links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 22px;
  height: 74px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #0d1218;
  border: 1px solid var(--line);
}

.brand-text {
  display: grid;
  line-height: 1.5;
}

.brand-text strong {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.brand-text small {
  font-size: 10.5px;
  color: var(--muted);
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 460px;
  height: 42px;
  padding: 0 6px 0 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #0b0f14;
  color: var(--muted-2);
}

.search:focus-within {
  border-color: rgba(255, 59, 47, 0.45);
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--fg);
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.search-input::placeholder {
  color: #5e6a7a;
}

.search-btn {
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 7px;
  background: rgba(255, 59, 47, 0.14);
  color: #ff8d84;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.search-btn:hover {
  background: var(--accent);
  color: #fff;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: auto;
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 11px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  color: #d8e0e9;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
}

.action-link:hover {
  border-color: #3a4553;
}

.action-link.icon-only {
  width: 38px;
  justify-content: center;
  color: var(--muted);
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: linear-gradient(135deg, #ff5a3c, #c41f18);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
}

.count-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 13px;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff5540, var(--accent));
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  box-shadow: 0 12px 24px -14px rgba(255, 59, 47, 0.9);
}

.cart-count {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.28);
  font-size: 11px;
  font-weight: 800;
}

.burger {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--fg);
  cursor: pointer;
}

.usermenu {
  position: relative;
}

.usermenu summary {
  list-style: none;
}

.usermenu summary::-webkit-details-marker {
  display: none;
}

.usermenu-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 220px;
  padding: 8px;
  background: #0d1218;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: var(--shadow);
  display: grid;
  gap: 2px;
  z-index: 70;
}

.usermenu-head {
  display: grid;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 4px;
}

.usermenu-item {
  display: block;
  width: 100%;
  text-align: right;
  padding: 8px 10px;
  border: none;
  background: transparent;
  border-radius: 7px;
  color: #d3dce5;
  font-size: 12.5px;
  font-family: inherit;
  cursor: pointer;
}

.usermenu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.usermenu-item.admin {
  color: #ffc55c;
}

.usermenu-item.danger {
  color: #ff8d9b;
}

.navrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  border-top: 1px solid var(--line-soft);
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #aeb9c6;
  cursor: pointer;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.active {
  color: #fff;
  background: rgba(255, 59, 47, 0.12);
}

.mega {
  position: static;
}

.mega summary {
  list-style: none;
}

.mega summary::-webkit-details-marker {
  display: none;
}

.mega[open] .mega-btn {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.mega-panel {
  position: absolute;
  right: 0;
  left: 0;
  top: 100%;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 26px;
  padding: 24px;
  background: #0b0f15;
  border: 1px solid var(--line);
  border-top: none;
  border-radius: 0 0 16px 16px;
  box-shadow: var(--shadow);
  z-index: 65;
}

.mega-title {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin-bottom: 12px;
}

.mega-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 18px;
}

.mega-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 9px;
  border-radius: 7px;
  font-size: 13px;
  color: #cdd6e0;
}

.mega-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.mega-count {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--muted-2);
}

.mega-col.side {
  border-right: 1px solid var(--line-soft);
  padding-right: 24px;
}

.mega-models {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.model-chip {
  padding: 5px 11px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: #0e131a;
  font-family: var(--mono);
  font-size: 11.5px;
  color: #d7e0e9;
}

.model-chip:hover {
  border-color: rgba(255, 59, 47, 0.5);
  color: #fff;
}

.mega-all {
  display: inline-block;
  margin-top: 14px;
  color: #ff8d84;
  font-size: 12.5px;
  font-weight: 700;
}

.nav-note {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
}

.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2fd07d;
  box-shadow: 0 0 0 0 rgba(47, 208, 125, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  70% { box-shadow: 0 0 0 7px rgba(47, 208, 125, 0); }
  100% { box-shadow: 0 0 0 0 rgba(47, 208, 125, 0); }
}

.mobile-panel {
  display: none;
  padding: 14px;
  border-top: 1px solid var(--line-soft);
  background: #080b0f;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
}

.mobile-nav {
  display: grid;
  gap: 2px;
  padding-block: 10px;
}

.mobile-link {
  padding: 11px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.mobile-link.accent {
  color: #ff8d84;
}

.mobile-search {
  max-width: 100%;
  margin-bottom: 8px;
}

.mobile-cats {
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}

.mobile-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 11px;
  border-radius: 10px;
  background: rgba(255, 59, 47, 0.1);
  border: 1px solid rgba(255, 59, 47, 0.25);
  color: #ffb4ad;
  font-size: 12.5px;
  font-weight: 700;
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.18s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

@media (max-width: 1160px) {
  .nav-note { display: none; }
}

@media (max-width: 1024px) {
  .search { display: none; }
  .nav { display: none; }
  .navrow { display: none; }
  .burger { display: grid; place-items: center; }
  .mobile-panel { display: block; }
  .topbar-item.hide-sm { display: none; }
  .navbar-inner { height: 66px; }
}

@media (max-width: 620px) {
  .cart-text { display: none; }
  .login-link span { display: none; }
  .login-link { width: 38px; justify-content: center; padding: 0; }
  .user-name { display: none; }
  .brand-text small { display: none; }
  .topbar { font-size: 10.5px; }
  .topbar-inner { height: 30px; }
}
</style>
