<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastStack />
  </div>
</template>

<script setup lang="ts">
const brand = 'یدک سیستم';

useHead({
  titleTemplate: (title) => {
    if (!title) return `${brand} | فروشگاه لوازم یدکی MVM — نمایندگی MVM فلاحی در یزد`;
    // عنوان‌هایی که از پنل سئو می‌آیند خودشان برند را دارند و نباید تکرار شود
    return title.includes(brand) ? title : `${title} | ${brand}`;
  },
});
</script>
