<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const route = useRoute();
const { api } = useApi();
const toast = useToast();
const id = String(route.params.id);

const { data: product } = await useAsyncData(`admin:product:${id}`, () =>
  api<any>(`/api/admin/products/${id}`),
);
const { data: categories } = await useAsyncData('admin:categories', () => api<any[]>('/api/admin/categories'), {
  default: () => [],
});
const { data: models } = await useAsyncData('admin:models', () => api<any[]>('/api/models'), {
  default: () => [],
});

const saving = ref(false);

const submit = async (payload: any) => {
  saving.value = true;
  try {
    await api(`/api/admin/products/${id}`, { method: 'PATCH', body: payload });
    toast.push('تغییرات محصول ذخیره شد.');
    await navigateTo('/admin/products');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    saving.value = false;
  }
};

useHead({ title: product.value ? `ویرایش ${product.value.name}` : 'ویرایش محصول' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <NuxtLink to="/admin/products" class="back">← بازگشت به محصولات</NuxtLink>
        <h1 class="h2">ویرایش محصول</h1>
        <p v-if="product" class="tiny muted mono">{{ product.sku }} — {{ product.name }}</p>
      </div>
      <NuxtLink v-if="product" :to="`/products/${product.slug}`" target="_blank" class="btn btn-outline btn-sm">
        مشاهده در سایت
      </NuxtLink>
    </div>

    <ProductForm
      v-if="product && categories"
      :product="product"
      :categories="categories"
      :models="models || []"
      :saving="saving"
      @submit="submit"
    />
  </div>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.back {
  font-size: 11.5px;
  color: #ff8d84;
}
</style>
