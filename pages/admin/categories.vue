<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const { data: categories, refresh } = await useAsyncData(
  'admin:categories',
  () => api<any[]>('/api/admin/categories'),
  { default: () => [] },
);

const icons = [
  ['engine', 'موتور'],
  ['brake', 'ترمز'],
  ['filter', 'فیلتر'],
  ['electrical', 'برق'],
  ['suspension', 'تعلیق'],
  ['cooling', 'خنک‌کاری'],
  ['body', 'بدنه'],
  ['fluids', 'مایعات'],
];

const blank = () => ({
  name: '',
  slug: '',
  description: '',
  icon: 'filter',
  sort: (categories.value?.length || 0) + 1,
  isActive: true,
});

const form = reactive(blank());
const editingId = ref<string | null>(null);
const saving = ref(false);

const startEdit = (cat: any) => {
  editingId.value = cat.id;
  Object.assign(form, {
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    icon: cat.icon || 'filter',
    sort: cat.sort,
    isActive: cat.isActive,
  });
};

const reset = () => {
  editingId.value = null;
  Object.assign(form, blank());
};

const save = async () => {
  saving.value = true;
  try {
    if (editingId.value) {
      await api(`/api/admin/categories/${editingId.value}`, { method: 'PATCH', body: { ...form } });
      toast.push('دسته‌بندی ویرایش شد.');
    } else {
      await api('/api/admin/categories', { method: 'POST', body: { ...form } });
      toast.push('دسته‌بندی جدید ثبت شد.');
    }
    reset();
    await refresh();
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    saving.value = false;
  }
};

const remove = async (cat: any) => {
  if (import.meta.client && !window.confirm(`دسته «${cat.name}» حذف شود؟`)) return;
  try {
    await api(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
    await refresh();
    toast.push('دسته‌بندی حذف شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

useHead({ title: 'دسته‌بندی‌ها | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">ساختار فروشگاه</span>
        <h1 class="h2">دسته‌بندی قطعات</h1>
      </div>
    </div>

    <div class="cat-layout">
      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">لیست دسته‌بندی‌ها</span>
          <span class="tiny muted">{{ faNum(categories.length) }} دسته</span>
        </div>
        <div class="table-wrap plain">
          <table class="table">
            <thead>
              <tr>
                <th>نام</th>
                <th>نامک</th>
                <th>تعداد قطعه</th>
                <th>ترتیب</th>
                <th>وضعیت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.id" :class="{ editing: editingId === cat.id }">
                <td>
                  <strong class="cat-name">{{ cat.name }}</strong>
                  <span class="tiny muted block">{{ cat.description }}</span>
                </td>
                <td class="mono tiny">{{ cat.slug }}</td>
                <td>{{ faNum(cat.productCount) }}</td>
                <td class="mono tiny">{{ faNum(cat.sort) }}</td>
                <td>
                  <span class="badge" :class="cat.isActive ? 'badge-ok' : 'badge-muted'">
                    {{ cat.isActive ? 'فعال' : 'غیرفعال' }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="mini-btn" @click="startEdit(cat)">ویرایش</button>
                    <button type="button" class="mini-btn danger" @click="remove(cat)">حذف</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="panel panel-pad form-panel">
        <h3 class="block-title">{{ editingId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی' }}</h3>
        <form class="stack" @submit.prevent="save">
          <div class="field">
            <label for="c-name">نام *</label>
            <input id="c-name" v-model="form.name" class="input" type="text" required />
          </div>
          <div class="field">
            <label for="c-slug">نامک (اختیاری)</label>
            <input id="c-slug" v-model="form.slug" class="input mono" type="text" dir="ltr" />
          </div>
          <div class="field">
            <label for="c-desc">توضیح</label>
            <textarea id="c-desc" v-model="form.description" class="textarea" rows="3" />
          </div>
          <div class="field">
            <label for="c-icon">آیکن</label>
            <select id="c-icon" v-model="form.icon" class="select">
              <option v-for="[value, label] in icons" :key="value" :value="value">{{ label }}</option>
            </select>
          </div>
          <div class="field">
            <label for="c-sort">ترتیب نمایش</label>
            <input id="c-sort" v-model.number="form.sort" class="input" type="number" min="0" />
          </div>
          <label class="checkbox">
            <input v-model="form.isActive" type="checkbox" />
            نمایش در سایت
          </label>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-block" :disabled="saving">
              {{ saving ? 'در حال ذخیره…' : editingId ? 'ذخیره تغییرات' : 'افزودن دسته' }}
            </button>
            <button v-if="editingId" type="button" class="btn btn-ghost btn-block" @click="reset">انصراف</button>
          </div>
        </form>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }

.cat-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 12px;
  align-items: start;
}

.table-wrap.plain { border: none; }

.cat-name { font-size: 12.5px; font-weight: 600; }

.block { display: block; }

tr.editing { background: rgba(255, 59, 47, 0.05); }

.row-actions { display: flex; gap: 5px; }

.mini-btn {
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  color: #c3cdd9;
  font-family: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

.mini-btn.danger { color: #ff8d9b; border-color: rgba(255, 84, 104, 0.3); }

.block-title {
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 12px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--line-soft);
}

.form-actions { display: grid; gap: 6px; }

@media (max-width: 980px) {
  .cat-layout { grid-template-columns: 1fr; }
}
</style>
