<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

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
    const product = await api<any>('/api/admin/products', { method: 'POST', body: payload });
    toast.push('محصول با موفقیت ثبت شد.');
    await navigateTo(`/admin/products/${product.id}`);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    saving.value = false;
  }
};

useHead({ title: 'محصول جدید | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <NuxtLink to="/admin/products" class="back">← بازگشت به محصولات</NuxtLink>
        <h1 class="h2">ثبت محصول جدید</h1>
      </div>
    </div>

    <ProductForm
      v-if="categories"
      :categories="categories"
      :models="models || []"
      :saving="saving"
      @submit="submit"
    />
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }

.back {
  font-size: 11.5px;
  color: #ff8d84;
}
</style>
