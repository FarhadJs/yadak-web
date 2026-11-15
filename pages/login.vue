<script setup lang="ts">
const route = useRoute();
const { login } = useAuth();
const toast = useToast();

useSeoMeta({
  title: 'ورود به حساب کاربری | یدک سیستم',
  description: 'ورود به حساب کاربری فروشگاه لوازم یدکی MVM در یدک سیستم، نمایندگی MVM فلاحی یزد.',
  robots: 'noindex,follow',
});

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const user = await login(email.value.trim(), password.value);
    toast.push(`خوش آمدید ${user.name.split(' ')[0]}!`);
    const redirect = String(route.query.redirect || (user.role === 'ADMIN' ? '/admin' : '/account'));
    await navigateTo(redirect);
  } catch (err: any) {
    error.value = errorMessage(err, 'ورود ناموفق بود.');
  } finally {
    loading.value = false;
  }
};

const fillDemo = (kind: 'admin' | 'customer') => {
  if (kind === 'admin') {
    email.value = 'admin@fallahi-mvm.ir';
    password.value = 'Admin@1234';
  } else {
    email.value = 'ali@example.com';
    password.value = 'User@1234';
  }
};
</script>

<template>
  <div class="auth-page container">
    <div class="auth-card">
      <aside class="auth-aside">
        <div class="auth-aside-inner">
          <span class="eyebrow">یدک سیستم</span>
          <h2>حساب کاربری، سبد خرید و پیگیری سفارش در یک‌جا</h2>
          <p>
            با عضویت در فروشگاه، سفارش‌ها را پیگیری کنید، قطعات مورد علاقه را ذخیره کنید و
            از تخفیف‌های نمایندگی باخبر شوید.
          </p>
          <ul class="auth-points">
            <li>✓ پیگیری لحظه‌ای وضعیت سفارش</li>
            <li>✓ ذخیره علاقه‌مندی‌ها</li>
            <li>✓ سبد خرید هم‌زمان روی همه دستگاه‌ها</li>
          </ul>
          <div class="auth-art"><PartArt kind="engine" /></div>
        </div>
      </aside>

      <div class="auth-form-wrap">
        <div class="auth-form">
          <h1 class="h2">ورود به حساب</h1>
          <p class="muted small">ایمیل و رمز عبور خود را وارد کنید.</p>

          <form class="stack" @submit.prevent="submit">
            <div class="field">
              <label for="email">ایمیل</label>
              <input id="email" v-model="email" class="input mono" type="email" autocomplete="email" dir="ltr" required />
            </div>
            <div class="field">
              <label for="password">رمز عبور</label>
              <input id="password" v-model="password" class="input" type="password" autocomplete="current-password" required />
            </div>

            <p v-if="error" class="error-text">{{ error }}</p>

            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              {{ loading ? 'در حال ورود…' : 'ورود به حساب' }}
            </button>
          </form>

          <p class="switch">
            حساب کاربری ندارید؟
            <NuxtLink to="/register">ثبت‌نام کنید</NuxtLink>
          </p>

          <div class="demo-box">
            <span class="demo-title">ورود سریع با حساب دمو</span>
            <div class="demo-actions">
              <button type="button" class="btn btn-outline btn-sm" @click="fillDemo('customer')">مشتری نمونه</button>
              <button type="button" class="btn btn-outline btn-sm" @click="fillDemo('admin')">مدیر سایت</button>
            </div>
            <p class="tiny muted">
              مدیر: admin@fallahi-mvm.ir / Admin@1234 — مشتری: ali@example.com / User@1234
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  padding-block: 40px 60px;
}

.auth-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 560px;
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  background: var(--panel);
}

.auth-aside {
  position: relative;
  background:
    radial-gradient(70% 70% at 30% 20%, rgba(255, 59, 47, 0.2), transparent 65%),
    linear-gradient(160deg, #14100f, #0a0e13);
  padding: 36px;
  overflow: hidden;
}

.auth-aside-inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
  align-content: start;
}

.auth-aside h2 {
  font-size: 24px;
  font-weight: 900;
  line-height: 1.55;
  letter-spacing: -0.01em;
}

.auth-aside p {
  font-size: 12.5px;
  color: var(--muted);
  line-height: 2;
}

.auth-points {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #cdd6e0;
  margin-top: 6px;
}

.auth-art {
  width: 170px;
  height: 150px;
  margin-top: 10px;
  opacity: 0.9;
}

.auth-form-wrap {
  display: grid;
  place-items: center;
  padding: 32px;
}

.auth-form {
  width: 100%;
  max-width: 340px;
  display: grid;
  gap: 14px;
}

.switch {
  font-size: 12.5px;
  color: var(--muted);
  text-align: center;
}

.switch a {
  color: #ff8d84;
  font-weight: 700;
}

.demo-box {
  display: grid;
  gap: 8px;
  padding: 13px;
  border: 1px dashed var(--line);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.015);
}

.demo-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #c3cdd9;
}

.demo-actions {
  display: flex;
  gap: 6px;
}

.demo-actions .btn {
  flex: 1;
}

@media (max-width: 860px) {
  .auth-card { grid-template-columns: 1fr; }
  .auth-aside { display: none; }
  .auth-form-wrap { padding: 24px; }
}
</style>
