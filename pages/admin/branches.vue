<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const { data: branches, refresh } = await useAsyncData(
  'admin:branches',
  () => api<any[]>('/api/admin/branches'),
  { default: () => [] },
);

const drafts = reactive<Record<string, any>>({});
const savingId = ref<string | null>(null);

watch(
  branches,
  () => {
    (branches.value || []).forEach((b: any) => {
      drafts[b.id] = { ...b };
    });
  },
  { immediate: true },
);

const save = async (b: any) => {
  const draft = drafts[b.id];
  savingId.value = b.id;
  try {
    await api(`/api/admin/branches/${b.id}`, {
      method: 'PATCH',
      body: {
        name: draft.name,
        city: draft.city,
        address: draft.address,
        phone: draft.phone,
        mobile: draft.mobile,
        hours: draft.hours,
      },
    });
    await refresh();
    toast.push('اطلاعات شعبه ذخیره شد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    savingId.value = null;
  }
};

useHead({ title: 'شعب نمایندگی | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">اطلاعات تماس حضوری</span>
        <h1 class="h2">شعب نمایندگی</h1>
        <p class="muted small">آدرس، تلفن و ساعات کاری شعب در صفحه «شعب نمایندگی» سایت نمایش داده می‌شود.</p>
      </div>
    </div>

    <div class="branch-grid">
      <section v-for="b in branches" :key="b.id" class="panel panel-pad branch-card">
        <div class="branch-head">
          <span class="branch-city mono">{{ drafts[b.id]?.city }}</span>
          <span v-if="b.isMain" class="badge badge-accent">شعبه مرکزی</span>
        </div>

        <div class="stack">
          <div class="field">
            <label>نام شعبه</label>
            <input v-model="drafts[b.id].name" class="input" type="text" />
          </div>
          <div class="field">
            <label>شهر</label>
            <input v-model="drafts[b.id].city" class="input" type="text" />
          </div>
          <div class="field">
            <label>آدرس</label>
            <textarea v-model="drafts[b.id].address" class="textarea" rows="2" />
          </div>
          <div class="form-grid">
            <div class="field">
              <label>تلفن</label>
              <input v-model="drafts[b.id].phone" class="input mono" type="text" dir="ltr" />
            </div>
            <div class="field">
              <label>موبایل</label>
              <input v-model="drafts[b.id].mobile" class="input mono" type="text" dir="ltr" />
            </div>
          </div>
          <div class="field">
            <label>ساعات کاری</label>
            <input v-model="drafts[b.id].hours" class="input" type="text" />
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-sm btn-block" :disabled="savingId === b.id" @click="save(b)">
          {{ savingId === b.id ? 'در حال ذخیره…' : 'ذخیره تغییرات' }}
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }

.branch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.branch-card {
  display: grid;
  gap: 14px;
  align-content: start;
}

.branch-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.branch-city {
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: var(--accent);
}

@media (max-width: 900px) {
  .branch-grid { grid-template-columns: 1fr; }
}
</style>
