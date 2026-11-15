<script setup lang="ts">
const props = defineProps<{
  product?: any;
  categories: any[];
  models: any[];
  saving?: boolean;
}>();

const emit = defineEmits<{ submit: [payload: any] }>();

const { api } = useApi();
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref('');

const artOptions = [
  ['pad', 'لنت ترمز'],
  ['disc', 'دیسک / کالیپر'],
  ['filter', 'فیلتر'],
  ['plug', 'شمع / وایر'],
  ['light', 'چراغ'],
  ['battery', 'باتری / دینام'],
  ['radiator', 'رادیاتور / فن'],
  ['shock', 'کمک فنر / جلوبندی'],
  ['belt', 'تسمه / برف‌پاک‌کن'],
  ['clutch', 'کلاچ'],
  ['mirror', 'آینه'],
  ['bumper', 'سپر / بدنه'],
  ['fluid', 'روغن و مایعات'],
  ['sensor', 'سنسور'],
  ['pump', 'پمپ'],
  ['engine', 'موتور / واشر'],
];

const form = reactive({
  name: props.product?.name || '',
  sku: props.product?.sku || '',
  slug: props.product?.slug || '',
  categoryId: props.product?.category?.id || props.categories[0]?.id || '',
  price: props.product?.price ?? 0,
  comparePrice: props.product?.comparePrice ?? 0,
  stock: props.product?.stock ?? 0,
  minStock: props.product?.minStock ?? 3,
  unit: props.product?.unit || 'عدد',
  shortDesc: props.product?.shortDesc || '',
  description: props.product?.description || '',
  art: props.product?.art || 'filter',
  imageUrl: props.product?.image || '',
  badge: props.product?.badge || '',
  isActive: props.product ? props.product.isActive : true,
  isFeatured: props.product ? props.product.isFeatured : false,
  modelIds: [...(props.product?.modelIds || [])] as string[],
});

const specs = ref<{ key: string; value: string }[]>(
  (props.product?.specs || []).map((s: any) => ({ key: s[0], value: s[1] })),
);

const errors = ref<string[]>([]);

const pickImage = () => fileInput.value?.click();

const onImagePicked = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    uploadError.value = 'فقط تصویر JPG، PNG، WebP یا GIF مجاز است.';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.';
    return;
  }

  uploadError.value = '';
  uploading.value = true;
  try {
    const body = new FormData();
    body.append('file', file);
    const res = await api<{ url: string }>('/api/admin/uploads', { method: 'POST', body });
    form.imageUrl = res.url;
  } catch (error: any) {
    uploadError.value = errorMessage(error) || 'آپلود تصویر انجام نشد.';
  } finally {
    uploading.value = false;
  }
};

const removeImage = () => {
  form.imageUrl = '';
};

const toggleModel = (id: string) => {
  form.modelIds = form.modelIds.includes(id)
    ? form.modelIds.filter((m) => m !== id)
    : [...form.modelIds, id];
};

const submit = () => {
  const list: string[] = [];
  if (form.name.trim().length < 3) list.push('نام محصول را کامل وارد کنید.');
  if (!form.sku.trim()) list.push('کد فنی (SKU) الزامی است.');
  if (!form.categoryId) list.push('دسته‌بندی را انتخاب کنید.');
  if (Number(form.price) <= 0) list.push('قیمت باید بزرگ‌تر از صفر باشد.');
  errors.value = list;
  if (list.length) return;

  emit('submit', {
    ...form,
    imageUrl: form.imageUrl || '',
    price: Number(form.price),
    comparePrice: Number(form.comparePrice) || 0,
    stock: Number(form.stock),
    minStock: Number(form.minStock),
    specs: specs.value.filter((s) => s.key.trim() && s.value.trim()).map((s) => [s.key.trim(), s.value.trim()]),
  });
};
</script>

<template>
  <form class="product-form" @submit.prevent="submit">
    <div class="form-layout">
      <div class="stack">
        <section class="panel panel-pad">
          <h3 class="block-title">اطلاعات اصلی</h3>
          <div class="form-grid">
            <div class="field span-2">
              <label for="f-name">نام محصول *</label>
              <input id="f-name" v-model="form.name" class="input" type="text" placeholder="مثلاً لنت ترمز جلو MVM 315" required />
            </div>
            <div class="field">
              <label for="f-sku">کد فنی / SKU *</label>
              <input id="f-sku" v-model="form.sku" class="input mono" type="text" dir="ltr" placeholder="BRK-315-F" required />
            </div>
            <div class="field">
              <label for="f-slug">نامک URL (اختیاری)</label>
              <input id="f-slug" v-model="form.slug" class="input mono" type="text" dir="ltr" placeholder="lent-tormoz-315" />
            </div>
            <div class="field">
              <label for="f-cat">دسته‌بندی *</label>
              <select id="f-cat" v-model="form.categoryId" class="select" required>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="field">
              <label for="f-art">طرح تصویر (وقتی عکس آپلود نشده)</label>
              <select id="f-art" v-model="form.art" class="select">
                <option v-for="[value, label] in artOptions" :key="value" :value="value">{{ label }}</option>
              </select>
            </div>
            <div class="field span-2">
              <label for="f-short">توضیح کوتاه (برای کارت محصول)</label>
              <input id="f-short" v-model="form.shortDesc" class="input" type="text" />
            </div>
            <div class="field span-2">
              <label for="f-desc">توضیحات کامل</label>
              <textarea id="f-desc" v-model="form.description" class="textarea" rows="5" />
            </div>
          </div>
        </section>

        <section class="panel panel-pad">
          <div class="row-between">
            <h3 class="block-title">مشخصات فنی</h3>
            <button type="button" class="btn btn-outline btn-sm" @click="specs.push({ key: '', value: '' })">+ ردیف</button>
          </div>
          <div class="specs-editor">
            <div v-for="(spec, i) in specs" :key="i" class="spec-row">
              <input v-model="spec.key" class="input" type="text" placeholder="عنوان (مثلاً جنس)" />
              <input v-model="spec.value" class="input" type="text" placeholder="مقدار (مثلاً سرامیک)" />
              <button type="button" class="spec-del" aria-label="حذف" @click="specs.splice(i, 1)">×</button>
            </div>
            <p v-if="!specs.length" class="tiny muted">هنوز مشخصاتی اضافه نشده است.</p>
          </div>
        </section>

        <section class="panel panel-pad">
          <h3 class="block-title">سازگاری با مدل‌های MVM</h3>
          <div class="model-checks">
            <label v-for="m in models" :key="m.id" class="model-check" :class="{ selected: form.modelIds.includes(m.id) }">
              <input type="checkbox" :checked="form.modelIds.includes(m.id)" @change="toggleModel(m.id)" />
              <span class="mono">{{ m.name }}</span>
            </label>
          </div>
        </section>
      </div>

      <aside class="stack">
        <section class="panel panel-pad">
          <h3 class="block-title">قیمت و موجودی</h3>
          <div class="form-grid">
            <div class="field">
              <label for="f-price">قیمت (تومان) *</label>
              <input id="f-price" v-model.number="form.price" class="input" type="number" min="0" step="1000" />
            </div>
            <div class="field">
              <label for="f-compare">قیمت قبل از تخفیف</label>
              <input id="f-compare" v-model.number="form.comparePrice" class="input" type="number" min="0" step="1000" />
            </div>
            <div class="field">
              <label for="f-stock">موجودی انبار</label>
              <input id="f-stock" v-model.number="form.stock" class="input" type="number" min="0" />
            </div>
            <div class="field">
              <label for="f-min">حد هشدار موجودی</label>
              <input id="f-min" v-model.number="form.minStock" class="input" type="number" min="0" />
            </div>
            <div class="field">
              <label for="f-unit">واحد</label>
              <select id="f-unit" v-model="form.unit" class="select">
                <option value="عدد">عدد</option>
                <option value="ست">ست</option>
                <option value="لیتر">لیتر</option>
                <option value="جفت">جفت</option>
              </select>
            </div>
            <div class="field">
              <label for="f-badge">برچسب ویژه</label>
              <input id="f-badge" v-model="form.badge" class="input" type="text" placeholder="پرفروش / اصل" />
            </div>
          </div>

          <div class="toggle-list">
            <label class="checkbox">
              <input v-model="form.isActive" type="checkbox" />
              نمایش در فروشگاه (فعال)
            </label>
            <label class="checkbox">
              <input v-model="form.isFeatured" type="checkbox" />
              نمایش در پرفروش‌های صفحه اصلی
            </label>
          </div>
        </section>

        <section class="panel panel-pad preview-panel">
          <h3 class="block-title">تصویر محصول</h3>
          <div class="preview-art tech-grid">
            <img v-if="form.imageUrl" :src="form.imageUrl" :alt="form.name || 'تصویر محصول'" class="preview-img" />
            <PartArt v-else :kind="form.art" :label="form.name || 'پیش‌نمایش'" />
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="file-input"
            @change="onImagePicked"
          />

          <div class="upload-actions">
            <button type="button" class="btn btn-outline btn-sm" :disabled="uploading" @click="pickImage">
              {{ uploading ? 'در حال آپلود…' : form.imageUrl ? 'تغییر عکس' : 'آپلود عکس محصول' }}
            </button>
            <button v-if="form.imageUrl" type="button" class="btn btn-ghost btn-sm" :disabled="uploading" @click="removeImage">
              حذف عکس
            </button>
          </div>

          <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
          <p v-else class="tiny muted">
            JPG، PNG، WebP یا GIF تا ۵ مگابایت. اگر عکسی آپلود نشود، طرح گرافیکی پیش‌فرض نمایش داده می‌شود.
          </p>
        </section>

        <div v-if="errors.length" class="errors">
          <p v-for="e in errors" :key="e">{{ e }}</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block" :disabled="saving">
            {{ saving ? 'در حال ذخیره…' : 'ذخیره محصول' }}
          </button>
          <NuxtLink to="/admin/products" class="btn btn-ghost btn-block">انصراف</NuxtLink>
        </div>
      </aside>
    </div>
  </form>
</template>

<style scoped>
.form-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.block-title {
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 12px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--line-soft);
}

.specs-editor {
  display: grid;
  gap: 7px;
}

.spec-row {
  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 6px;
}

.spec-del {
  width: 32px;
  height: 38px;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted-2);
  font-size: 17px;
  cursor: pointer;
}

.spec-del:hover { color: #ff8d9b; }

.model-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.model-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 11.5px;
  cursor: pointer;
  color: #b9c4d1;
}

.model-check input {
  accent-color: var(--accent);
  width: 14px;
  height: 14px;
}

.model-check.selected {
  border-color: rgba(255, 59, 47, 0.5);
  background: rgba(255, 59, 47, 0.08);
  color: #fff;
}

.toggle-list {
  display: grid;
  gap: 9px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line-soft);
}

.file-input {
  display: none;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  background: #0b0f14;
}

.upload-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.upload-error {
  font-size: 11px;
  color: #ff9dab;
}

.preview-art {
  height: 150px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #0a0e13;
  padding: 10px;
  margin-bottom: 8px;
}

.errors {
  padding: 11px 13px;
  border-radius: 9px;
  background: rgba(255, 84, 104, 0.08);
  border: 1px solid rgba(255, 84, 104, 0.3);
  color: #ff9dab;
  font-size: 11.5px;
  display: grid;
  gap: 3px;
}

.form-actions {
  display: grid;
  gap: 6px;
}

@media (max-width: 960px) {
  .form-layout { grid-template-columns: 1fr; }
}
</style>
