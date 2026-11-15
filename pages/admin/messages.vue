<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'dashboard' });

const { api } = useApi();
const toast = useToast();

const { data: messages, refresh } = await useAsyncData(
  'admin:messages',
  () => api<any[]>('/api/admin/messages'),
  { default: () => [] },
);

const unread = computed(() => messages.value.filter((m) => !m.isRead).length);

const toggleRead = async (message: any) => {
  try {
    await api(`/api/admin/messages/${message.id}`, {
      method: 'PATCH',
      body: { isRead: !message.isRead },
    });
    await refresh();
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};

useHead({ title: 'پیام‌های کاربران | پنل یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">صندوق ورودی</span>
        <h1 class="h2">پیام‌های کاربران</h1>
        <p class="muted small">{{ faNum(messages.length) }} پیام — {{ faNum(unread) }} خوانده‌نشده.</p>
      </div>
    </div>

    <div v-if="messages.length" class="msg-list">
      <article v-for="m in messages" :key="m.id" class="msg-card" :class="{ unread: !m.isRead }">
        <div class="msg-head">
          <div class="msg-sender">
            <span class="msg-avatar">{{ m.name.slice(0, 1) }}</span>
            <div>
              <strong>{{ m.name }}</strong>
              <span class="tiny muted block">
                {{ m.subject }} — {{ faDateTime(m.createdAt) }}
              </span>
            </div>
          </div>
          <span v-if="!m.isRead" class="badge badge-accent">جدید</span>
        </div>

        <p class="msg-body">{{ m.body }}</p>

        <div class="msg-foot">
          <div class="msg-contacts">
            <a :href="`tel:${m.phone}`" class="mono">{{ m.phone }}</a>
            <a v-if="m.email" :href="`mailto:${m.email}`" class="tiny muted">{{ m.email }}</a>
          </div>
          <div class="row">
            <a v-if="m.phone" :href="`tel:${m.phone}`" class="btn btn-outline btn-sm">تماس</a>
            <button type="button" class="btn btn-dark btn-sm" @click="toggleRead(m)">
              {{ m.isRead ? 'علامت خوانده‌نشده' : 'علامت خوانده‌شده' }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty panel">
      <h3>پیامی دریافت نشده است</h3>
      <p>پیام‌های فرم تماس سایت در این بخش نمایش داده می‌شوند.</p>
    </div>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }

.msg-list {
  display: grid;
  gap: 10px;
}

.msg-card {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}

.msg-card.unread {
  border-color: rgba(255, 59, 47, 0.3);
  background: linear-gradient(150deg, rgba(255, 59, 47, 0.06), transparent 55%), var(--panel);
}

.msg-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.msg-sender {
  display: flex;
  align-items: center;
  gap: 9px;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}

.msg-sender strong { font-size: 12.5px; }

.block { display: block; }

.msg-body {
  margin: 12px 0;
  padding: 11px 13px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.025);
  font-size: 12px;
  line-height: 2;
  color: #c8d2dd;
}

.msg-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.msg-contacts {
  display: flex;
  gap: 14px;
  align-items: center;
  font-size: 11.5px;
}
</style>
