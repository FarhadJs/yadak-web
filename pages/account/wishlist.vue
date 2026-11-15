<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' });

const wishlist = useWishlist();
await wishlist.load();

const items = computed(() =>
  wishlist.items.value.map((p: any) => ({
    ...p,
    unit: p.unit || 'عدد',
    models: [],
    badge: null,
    isFeatured: false,
    discountPercent:
      p.comparePrice && p.comparePrice > p.price
        ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
        : 0,
  })),
);

useHead({ title: 'علاقه‌مندی‌ها | یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">ذخیره‌شده‌ها</span>
        <h1 class="h2">محصولات مورد علاقه</h1>
        <p class="muted small">قطعاتی که برای بعد ذخیره کرده‌اید.</p>
      </div>
      <NuxtLink to="/products" class="btn btn-outline btn-sm">افزودن قطعه جدید</NuxtLink>
    </div>

    <div v-if="items.length" class="wish-grid">
      <ProductCard v-for="p in items" :key="p.id" :product="p" />
    </div>

    <div v-else class="empty panel">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.4">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      <h3>لیست علاقه‌مندی‌ها خالی است</h3>
      <p>روی آیکن قلب هر قطعه بزنید تا اینجا ذخیره شود.</p>
      <NuxtLink to="/products" class="btn btn-primary btn-sm">مشاهده قطعات</NuxtLink>
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

.wish-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 1100px) {
  .wish-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .wish-grid { grid-template-columns: 1fr; }
}
</style>
