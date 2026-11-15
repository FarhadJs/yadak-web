<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

useHead({ title: `${props.error.statusCode} | یدک سیستم` });
</script>

<template>
  <div class="error-page">
    <div class="container error-inner">
      <span class="code mono">{{ error.statusCode }}</span>
      <h1 class="h2">
        {{ error.statusCode === 404 ? 'این صفحه در انبار پیدا نشد!' : 'مشکلی پیش آمد' }}
      </h1>
      <p class="muted">
        {{
          error.statusCode === 404
            ? 'آدرس اشتباه است یا صفحه جابه‌جا شده. از فروشگاه قطعات شروع کنید.'
            : 'لطفاً چند لحظه بعد دوباره تلاش کنید یا با پشتیبانی نمایندگی تماس بگیرید.'
        }}
      </p>
      <div class="row">
        <NuxtLink to="/" class="btn btn-primary">بازگشت به خانه</NuxtLink>
        <NuxtLink to="/products" class="btn btn-outline">مشاهده قطعات</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(40% 50% at 50% 0%, rgba(255, 59, 47, 0.16), transparent 70%),
    var(--bg);
  padding: 30px;
}

.error-inner {
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
  max-width: 520px;
}

.code {
  font-size: clamp(70px, 14vw, 120px);
  font-weight: 800;
  line-height: 1;
  color: rgba(255, 59, 47, 0.85);
  text-shadow: 0 0 60px rgba(255, 59, 47, 0.4);
}
</style>
