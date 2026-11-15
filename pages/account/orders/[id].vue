<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' });

const route = useRoute();
const { api } = useApi();

const { data: order } = await useAsyncData(`account:order:${route.params.id}`, () =>
  api<any>(`/api/orders/${route.params.id}`),
);

if (!order.value) {
  throw createError({ statusCode: 404, statusMessage: 'سفارش یافت نشد', fatal: true });
}

const isNew = computed(() => route.query.new === '1');

const toast = useToast();
const canceling = ref(false);

/** لغو سفارش فقط تا قبل از تأیید و ارسال مجاز است */
const canCancel = computed(() => ['PENDING', 'PAID'].includes(order.value?.status));

const cancelOrder = async () => {
  if (!import.meta.client) return;
  const ok = window.confirm(
    'سفارش لغو شود؟ موجودی قطعات به انبار برمی‌گردد و در صورت پرداخت آنلاین، مبلغ تا ۷۲ ساعت به حساب شما بازگردانده می‌شود.',
  );
  if (!ok) return;
  canceling.value = true;
  try {
    order.value = await api(`/api/orders/${order.value.id}/cancel`, { method: 'POST' });
    toast.push('سفارش شما لغو شد و موجودی قطعات آزاد شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    canceling.value = false;
  }
};

const steps = [
  { key: 'PENDING', label: 'ثبت سفارش', desc: 'سفارش شما دریافت شد' },
  { key: 'PAID', label: 'پرداخت', desc: 'تأیید پرداخت یا پرداخت در محل' },
  { key: 'SHIPPED', label: 'ارسال', desc: 'تحویل به پست یا باربری' },
  { key: 'DELIVERED', label: 'تحویل', desc: 'دریافت توسط مشتری' },
];

const activeStep = computed(() => {
  const idx = steps.findIndex((s) => s.key === order.value.status);
  return idx === -1 ? 0 : idx;
});

useHead({ title: `سفارش ${order.value.orderNumber} | یدک سیستم` });
</script>

<template>
  <div>
    <div v-if="isNew" class="success-banner">
      <div class="success-icon">✓</div>
      <div>
        <strong>سفارش شما با موفقیت ثبت شد</strong>
        <p>کارشناسان نمایندگی در ساعات کاری برای هماهنگی ارسال با شما تماس می‌گیرند.</p>
      </div>
    </div>

    <div class="page-head">
      <div>
        <NuxtLink to="/account/orders" class="back-link">← بازگشت به سفارش‌ها</NuxtLink>
        <h1 class="h2">سفارش {{ order.orderNumber }}</h1>
        <p class="tiny muted">{{ faDateTime(order.createdAt) }}</p>
      </div>
      <div class="head-actions">
        <span class="badge big" :class="`badge-${statusTone(order.status)}`">{{ statusLabel(order.status) }}</span>
        <button
          v-if="canCancel"
          type="button"
          class="btn btn-danger btn-sm"
          :disabled="canceling"
          @click="cancelOrder"
        >
          {{ canceling ? 'در حال لغو…' : 'لغو سفارش' }}
        </button>
      </div>
    </div>

    <div v-if="order.status === 'CANCELED'" class="canceled-note">
      این سفارش لغو شده است. در صورت پرداخت آنلاین، مبلغ طی ۷۲ ساعت بازگردانده می‌شود.
    </div>

    <div v-else class="timeline panel">
      <div v-for="(step, i) in steps" :key="step.key" class="step" :class="{ done: i <= activeStep, current: i === activeStep }">
        <span class="step-dot">{{ i < activeStep ? '✓' : faNum(i + 1) }}</span>
        <div>
          <strong>{{ step.label }}</strong>
          <small>{{ step.desc }}</small>
        </div>
        <span v-if="i < steps.length - 1" class="step-line" />
      </div>
    </div>

    <p v-if="canCancel" class="cancel-hint">
      تا پیش از تأیید و ارسال سفارش، از همین صفحه می‌توانید آن را لغو کنید.
    </p>

    <div class="detail-grid">
      <section class="panel">
        <div class="panel-head">
          <span class="panel-title">اقلام سفارش</span>
          <span class="tiny muted">{{ faNum(order.items.length) }} قلم</span>
        </div>
        <div class="items">
          <div v-for="item in order.items" :key="item.id" class="item">
            <div class="item-info">
              <strong>{{ item.name }}</strong>
              <span class="mono tiny muted">{{ item.sku }}</span>
            </div>
            <span class="item-qty">{{ faNum(item.qty) }} × {{ toman(item.price) }}</span>
            <span class="item-total">{{ toman(item.lineTotal) }}</span>
          </div>
        </div>

        <div class="totals">
          <div><span>جمع کالاها</span><span>{{ toman(order.subtotal) }}</span></div>
          <div><span>هزینه ارسال</span><span>{{ order.shipping === 0 ? 'رایگان' : toman(order.shipping) }}</span></div>
          <div class="grand"><span>مبلغ کل</span><strong>{{ toman(order.total) }}</strong></div>
        </div>
      </section>

      <aside class="side">
        <div class="panel panel-pad">
          <span class="block-label">اطلاعات ارسال</span>
          <p class="ship-name">{{ order.customerName }}</p>
          <p class="ship-line mono tiny">{{ order.phone }}</p>
          <p class="ship-line">{{ order.province }}، {{ order.city }}</p>
          <p class="ship-line">{{ order.address }}</p>
          <p v-if="order.postalCode" class="ship-line tiny muted">کد پستی: {{ order.postalCode }}</p>
          <div class="divider" />
          <span class="block-label">روش پرداخت</span>
          <p class="ship-line">{{ PAYMENT_LABEL[order.paymentMethod] }}</p>
          <p v-if="order.note" class="note">یادداشت: {{ order.note }}</p>
        </div>

        <div class="panel panel-pad support">
          <strong>پیگیری سفارش</strong>
          <p class="tiny muted">برای تغییر آدرس یا سؤال درباره ارسال، با ما تماس بگیرید.</p>
          <a href="tel:03538226600" class="mono support-phone">۰۳۵-۳۸۲۲۶۶۰۰</a>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.success-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 18px;
  border-radius: 12px;
  border: 1px solid rgba(47, 208, 125, 0.3);
  background: rgba(47, 208, 125, 0.07);
  margin-bottom: 18px;
}

.success-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(47, 208, 125, 0.16);
  color: #58e2a1;
  font-weight: 800;
  flex-shrink: 0;
}

.success-banner strong {
  font-size: 13px;
}

.success-banner p {
  font-size: 11.5px;
  color: var(--muted);
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.back-link {
  font-size: 11.5px;
  color: #ff8d84;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.badge.big {
  padding: 6px 13px;
  font-size: 12px;
}

.cancel-hint {
  margin: -6px 0 14px;
  font-size: 11px;
  color: var(--muted-2);
}

.canceled-note {
  padding: 12px 15px;
  border-radius: 10px;
  background: rgba(255, 84, 104, 0.07);
  border: 1px solid rgba(255, 84, 104, 0.28);
  color: #ff9dab;
  font-size: 12px;
  margin-bottom: 14px;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 18px;
  margin-bottom: 14px;
}

.step {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: var(--muted-2);
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #0b0f14;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  z-index: 1;
}

.step strong {
  display: block;
  font-size: 12px;
  color: #c3cdd9;
}

.step small {
  font-size: 10px;
  color: var(--muted-2);
}

.step.done .step-dot {
  background: rgba(255, 59, 47, 0.15);
  border-color: rgba(255, 59, 47, 0.5);
  color: #ff8d84;
}

.step.done strong {
  color: #fff;
}

.step.current .step-dot {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(255, 59, 47, 0.15);
}

.step-line {
  position: absolute;
  top: 12px;
  right: 24px;
  width: calc(100% - 30px);
  height: 1px;
  background: var(--line);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 14px;
  align-items: start;
}

.items {
  display: grid;
}

.item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 14px;
  align-items: center;
  padding: 13px 18px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 12px;
}

.item-info {
  display: grid;
  gap: 2px;
}

.item-qty {
  color: var(--muted);
  font-size: 11px;
}

.item-total {
  font-weight: 700;
}

.totals {
  display: grid;
  gap: 6px;
  padding: 14px 18px;
  font-size: 12px;
  color: var(--muted);
}

.totals div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.totals .grand {
  padding-top: 8px;
  border-top: 1px solid var(--line-soft);
  color: #fff;
  align-items: center;
}

.totals .grand strong {
  font-size: 17px;
  font-weight: 900;
}

.side {
  display: grid;
  gap: 12px;
}

.block-label {
  font-size: 10.5px;
  color: var(--muted-2);
  letter-spacing: 0.04em;
}

.ship-name {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
}

.ship-line {
  font-size: 12px;
  color: #c3cdd9;
  line-height: 1.9;
}

.note {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.03);
  font-size: 11px;
  color: var(--muted);
}

.support p {
  margin: 5px 0 8px;
  line-height: 1.9;
}

.support-phone {
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
  .timeline { grid-template-columns: 1fr 1fr; gap: 14px; }
  .step-line { display: none; }
}

@media (max-width: 560px) {
  .item { grid-template-columns: 1fr auto; }
  .item-qty { grid-column: 1 / -1; }
}
</style>
