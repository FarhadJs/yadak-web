<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const { api } = useApi();
const { user } = useAuth();
const cart = useCart();
const toast = useToast();

await cart.load();

if (!cart.items.value.length) {
  await navigateTo('/cart');
}

useSeoMeta({
  title: 'تکمیل خرید | یدک سیستم',
  description: 'ثبت اطلاعات ارسال و پرداخت سفارش قطعات MVM.',
  robots: 'noindex,nofollow',
});

const form = reactive({
  customerName: user.value?.name || '',
  phone: user.value?.phone || '',
  province: 'یزد',
  city: 'یزد',
  address: '',
  postalCode: '',
  note: '',
  paymentMethod: 'ONLINE' as 'ONLINE' | 'COD' | 'CARD',
});

const submitting = ref(false);
const error = ref('');

const paymentOptions = [
  { value: 'ONLINE', title: 'پرداخت آنلاین', desc: 'انتقال به درگاه بانکی (در نسخه دمو شبیه‌سازی می‌شود)' },
  { value: 'COD', title: 'پرداخت در محل', desc: 'فقط برای یزد — هنگام تحویل وجه را پرداخت کنید' },
  { value: 'CARD', title: 'کارت به کارت', desc: 'شماره کارت پس از ثبت سفارش پیامک می‌شود' },
];

const submit = async () => {
  error.value = '';
  if (form.customerName.trim().length < 3) {
    error.value = 'نام و نام خانوادگی را کامل وارد کنید.';
    return;
  }
  if (form.phone.trim().length < 10) {
    error.value = 'شماره تماس معتبر وارد کنید.';
    return;
  }
  if (form.address.trim().length < 10) {
    error.value = 'آدرس را کامل وارد کنید.';
    return;
  }

  submitting.value = true;
  try {
    const order = await api<any>('/api/orders', { method: 'POST', body: { ...form } });
    toast.push('سفارش شما با موفقیت ثبت شد.');
    await cart.load();
    await navigateTo(`/account/orders/${order.id}?new=1`);
  } catch (err: any) {
    error.value = errorMessage(err);
    toast.push(error.value, 'error');
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="checkout container">
    <nav class="crumbs">
      <NuxtLink to="/cart">سبد خرید</NuxtLink><span>/</span><span>تکمیل خرید</span>
    </nav>

    <div class="section-head">
      <div>
        <span class="eyebrow">مرحله ۲ از ۲</span>
        <h1 class="h2">اطلاعات ارسال و پرداخت</h1>
      </div>
      <NuxtLink to="/cart" class="btn btn-ghost btn-sm">بازگشت به سبد</NuxtLink>
    </div>

    <form class="checkout-layout" @submit.prevent="submit">
      <div class="checkout-form">
        <section class="panel panel-pad">
          <h3 class="block-title">گیرنده سفارش</h3>
          <div class="form-grid">
            <div class="field">
              <label for="name">نام و نام خانوادگی</label>
              <input id="name" v-model="form.customerName" class="input" type="text" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="phone">شماره تماس</label>
              <input id="phone" v-model="form.phone" class="input" type="tel" inputmode="tel" autocomplete="tel" required />
            </div>
            <div class="field">
              <label for="province">استان</label>
              <select id="province" v-model="form.province" class="select">
                <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="field">
              <label for="city">شهر</label>
              <input id="city" v-model="form.city" class="input" type="text" required />
            </div>
            <div class="field span-2">
              <label for="address">آدرس کامل پستی</label>
              <textarea id="address" v-model="form.address" class="textarea" rows="3" required />
            </div>
            <div class="field">
              <label for="postal">کد پستی (اختیاری)</label>
              <input id="postal" v-model="form.postalCode" class="input mono" type="text" inputmode="numeric" />
            </div>
            <div class="field">
              <label for="note">توضیح سفارش (اختیاری)</label>
              <input id="note" v-model="form.note" class="input" type="text" placeholder="مثلاً: مدل خودرو ۱۳۹۹" />
            </div>
          </div>
        </section>

        <section class="panel panel-pad">
          <h3 class="block-title">روش پرداخت</h3>
          <div class="pay-options">
            <label v-for="opt in paymentOptions" :key="opt.value" class="pay-option" :class="{ selected: form.paymentMethod === opt.value }">
              <input v-model="form.paymentMethod" type="radio" :value="opt.value" name="payment" />
              <span class="pay-body">
                <strong>{{ opt.title }}</strong>
                <small>{{ opt.desc }}</small>
              </span>
            </label>
          </div>
        </section>

        <p v-if="error" class="form-error">{{ error }}</p>
      </div>

      <aside class="summary panel">
        <h3 class="summary-title">سفارش شما ({{ faNum(cart.summary.value.count) }} قطعه)</h3>

        <div class="mini-items">
          <div v-for="item in cart.items.value" :key="item.key" class="mini-item">
            <span class="mini-art"><PartArt :kind="item.product.art" /></span>
            <span class="mini-name">{{ item.product.name }}</span>
            <span class="mini-qty">×{{ faNum(item.qty) }}</span>
            <span class="mini-price">{{ toman(item.lineTotal) }}</span>
          </div>
        </div>

        <div class="summary-row">
          <span>جمع کالاها</span>
          <span>{{ toman(cart.summary.value.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>هزینه ارسال</span>
          <span>{{ cart.summary.value.shipping === 0 ? 'رایگان' : toman(cart.summary.value.shipping) }}</span>
        </div>
        <div class="summary-total">
          <span>مبلغ قابل پرداخت</span>
          <strong>{{ toman(cart.summary.value.total) }}</strong>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
          {{ submitting ? 'در حال ثبت سفارش…' : 'ثبت نهایی سفارش' }}
        </button>
        <p class="tiny muted">با ثبت سفارش، قوانین فروش و بازگشت کالای یدک سیستم را می‌پذیرید.</p>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.checkout {
  padding-block: 22px 50px;
}

.crumbs {
  display: flex;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 16px;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 22px;
  align-items: start;
}

.checkout-form {
  display: grid;
  gap: 16px;
}

.block-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
}

.pay-options {
  display: grid;
  gap: 8px;
}

.pay-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease;
}

.pay-option.selected {
  border-color: rgba(255, 59, 47, 0.5);
  background: rgba(255, 59, 47, 0.06);
}

.pay-option input {
  margin-top: 4px;
  accent-color: var(--accent);
}

.pay-body {
  display: grid;
  gap: 2px;
}

.pay-body strong {
  font-size: 12.5px;
}

.pay-body small {
  font-size: 11px;
  color: var(--muted);
}

.form-error {
  padding: 11px 14px;
  border-radius: 9px;
  background: rgba(255, 84, 104, 0.08);
  border: 1px solid rgba(255, 84, 104, 0.3);
  color: #ff9dab;
  font-size: 12.5px;
}

.summary {
  position: sticky;
  top: 174px;
  padding: 18px;
  display: grid;
  gap: 11px;
}

.summary-title {
  font-size: 13px;
  font-weight: 800;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
}

.mini-items {
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}

.mini-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  grid-template-areas: 'art name qty' 'art name price';
  gap: 2px 9px;
  align-items: center;
  font-size: 11px;
}

.mini-art {
  grid-area: art;
  width: 38px;
  height: 34px;
  padding: 3px;
  border-radius: 6px;
  background: #0b0f14;
  border: 1px solid var(--line-soft);
}

.mini-name {
  grid-area: name;
  color: #cfd8e2;
  line-height: 1.6;
}

.mini-qty {
  grid-area: qty;
  font-size: 10px;
  color: var(--muted-2);
}

.mini-price {
  grid-area: price;
  font-size: 11px;
  color: #fff;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--muted);
}

.summary-row span:last-child {
  color: #dde5ee;
}

.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  font-size: 13px;
}

.summary-total strong {
  font-size: 19px;
  font-weight: 900;
}

@media (max-width: 960px) {
  .checkout-layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
</style>
