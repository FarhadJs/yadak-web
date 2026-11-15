<script setup lang="ts">
const route = useRoute();
const { register } = useAuth();
const toast = useToast();

useSeoMeta({
  title: 'ثبت‌نام در فروشگاه قطعات MVM | یدک سیستم',
  description: 'ساخت حساب کاربری در فروشگاه لوازم یدکی MVM در یدک سیستم، نمایندگی MVM فلاحی یزد.',
  robots: 'noindex,follow',
});

const form = reactive({ name: '', email: '', phone: '', password: '' });
const loading = ref(false);
const error = ref('');
const accepted = ref(true);

const submit = async () => {
  error.value = '';
  if (!accepted.value) {
    error.value = 'برای ادامه، قوانین فروشگاه را بپذیرید.';
    return;
  }
  loading.value = true;
  try {
    const user = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
    });
    toast.push('حساب کاربری شما ساخته شد. خوش آمدید!');
    await navigateTo(String(route.query.redirect || '/account'));
  } catch (err: any) {
    error.value = errorMessage(err, 'ثبت‌نام ناموفق بود.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page container">
    <div class="auth-card">
      <aside class="auth-aside">
        <div class="auth-aside-inner">
          <span class="eyebrow">عضویت رایگان</span>
          <h2>عضو باشگاه مشتریان یدک سیستم شوید</h2>
          <p>
            سفارش‌های خود را ثبت و پیگیری کنید، قطعات مورد علاقه‌تان را ذخیره کنید و پیشنهادهای
            ویژه نمایندگی را زودتر از دیگران ببینید.
          </p>
          <ul class="auth-points">
            <li>✓ ثبت سفارش ۲۴ ساعته</li>
            <li>✓ سابقه خرید و فاکتور</li>
            <li>✓ مشاوره فنی اختصاصی</li>
          </ul>
          <div class="auth-art"><PartArt kind="clutch" /></div>
        </div>
      </aside>

      <div class="auth-form-wrap">
        <div class="auth-form">
          <h1 class="h2">ساخت حساب کاربری</h1>
          <p class="muted small">اطلاعات خود را وارد کنید؛ عضویت رایگان است.</p>

          <form class="stack" @submit.prevent="submit">
            <div class="field">
              <label for="name">نام و نام خانوادگی</label>
              <input id="name" v-model="form.name" class="input" type="text" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="email">ایمیل</label>
              <input id="email" v-model="form.email" class="input mono" type="email" autocomplete="email" dir="ltr" required />
            </div>
            <div class="field">
              <label for="phone">شماره موبایل (اختیاری)</label>
              <input id="phone" v-model="form.phone" class="input num" type="tel" autocomplete="tel" dir="ltr" />
            </div>
            <div class="field">
              <label for="password">رمز عبور</label>
              <input id="password" v-model="form.password" class="input" type="password" autocomplete="new-password" minlength="6" required />
              <span class="tiny muted">حداقل ۶ کاراکتر</span>
            </div>

            <label class="checkbox">
              <input v-model="accepted" type="checkbox" />
              قوانین و شرایط فروشگاه را می‌پذیرم.
            </label>

            <p v-if="error" class="error-text">{{ error }}</p>

            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              {{ loading ? 'در حال ساخت حساب…' : 'ثبت‌نام و ورود' }}
            </button>
          </form>

          <p class="switch">
            قبلاً عضو شده‌اید؟
            <NuxtLink to="/login">ورود به حساب</NuxtLink>
          </p>
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
  background:
    radial-gradient(70% 70% at 30% 20%, rgba(255, 176, 32, 0.16), transparent 65%),
    linear-gradient(160deg, #131110, #0a0e13);
  padding: 36px;
  order: 2;
}

.auth-aside-inner {
  display: grid;
  gap: 14px;
  align-content: start;
}

.auth-aside h2 {
  font-size: 24px;
  font-weight: 900;
  line-height: 1.55;
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

.num {
  font-family: var(--mono);
}

@media (max-width: 860px) {
  .auth-card { grid-template-columns: 1fr; }
  .auth-aside { display: none; }
  .auth-form-wrap { padding: 24px; }
}
</style>
