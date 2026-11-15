<script setup lang="ts">
const cart = useCart();
const { user } = useAuth();
const toast = useToast();

await cart.load();

useSeoMeta({
  title: 'سبد خرید | یدک سیستم',
  description: 'سبد خرید شما در فروشگاه لوازم یدکی MVM در یدک سیستم — نمایندگی MVM فلاحی یزد.',
  robots: 'noindex,follow',
});

const busyKey = ref<string | null>(null);

const changeQty = async (item: any, delta: number) => {
  const next = item.qty + delta;
  if (next < 1) return removeItem(item);
  if (next > item.product.stock) {
    toast.push('بیشتر از موجودی انبار نمی‌توانید انتخاب کنید.', 'warn');
    return;
  }
  busyKey.value = item.key;
  try {
    await cart.setQty(item.key, next);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    busyKey.value = null;
  }
};

const removeItem = async (item: any) => {
  busyKey.value = item.key;
  try {
    await cart.remove(item.key);
    toast.push('قطعه از سبد خرید حذف شد.', 'info');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    busyKey.value = null;
  }
};

const checkoutTo = computed(() => (user.value ? '/checkout' : '/login?redirect=/checkout'));

const freeShippingPercent = computed(() => {
  const s = cart.summary.value;
  if (!s.freeShippingThreshold) return 0;
  return Math.min(100, Math.round(((s.freeShippingThreshold - s.freeShippingRemaining) / s.freeShippingThreshold) * 100));
});
</script>

<template>
  <div class="cart-page container">
    <nav class="crumbs">
      <NuxtLink to="/">خانه</NuxtLink><span>/</span><span>سبد خرید</span>
    </nav>

    <div class="section-head">
      <div>
        <span class="eyebrow">مرحله ۱ از ۲</span>
        <h1 class="h2">سبد خرید</h1>
      </div>
      <NuxtLink to="/products" class="btn btn-outline btn-sm">ادامه خرید</NuxtLink>
    </div>

    <div v-if="!cart.items.value.length" class="empty panel">
      <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.3">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" stroke-linecap="round" />
        <circle cx="9.5" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      <h3>سبد خرید شما خالی است</h3>
      <p>هنوز قطعه‌ای انتخاب نکرده‌اید. از فروشگاه شروع کنید.</p>
      <NuxtLink to="/products" class="btn btn-primary">مشاهده قطعات</NuxtLink>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cart.items.value" :key="item.key" class="cart-item" :class="{ busy: busyKey === item.key }">
          <NuxtLink :to="`/products/${item.product.slug}`" class="item-art tech-grid">
            <img
              v-if="item.product.image"
              :src="item.product.image"
              :alt="item.product.name"
              class="item-img"
              loading="lazy"
            />
            <PartArt v-else :kind="item.product.art" :label="item.product.name" />
          </NuxtLink>

          <div class="item-info">
            <span class="item-cat">{{ item.product.category?.name }}</span>
            <NuxtLink :to="`/products/${item.product.slug}`" class="item-name">{{ item.product.name }}</NuxtLink>
            <span class="item-sku mono">{{ item.product.sku }}</span>
            <span class="item-stock" :class="item.product.inStock ? 'in' : 'out'">
              {{ item.product.inStock ? `موجود: ${faNum(item.product.stock)} ${item.product.unit}` : 'ناموجود' }}
            </span>
          </div>

          <div class="item-qty">
            <button type="button" aria-label="کاهش" :disabled="busyKey === item.key" @click="changeQty(item, -1)">−</button>
            <span>{{ faNum(item.qty) }}</span>
            <button type="button" aria-label="افزایش" :disabled="busyKey === item.key" @click="changeQty(item, 1)">+</button>
          </div>

          <div class="item-price">
            <span class="price">{{ toman(item.lineTotal) }}</span>
            <span class="tiny muted">{{ toman(item.product.price) }} × {{ faNum(item.qty) }}</span>
          </div>

          <button type="button" class="item-remove" aria-label="حذف از سبد" @click="removeItem(item)">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="cart-note">
          <span>
            هزینه ارسال برای سفارش‌های بالای {{ toman(cart.summary.value.freeShippingThreshold) }} رایگان است.
          </span>
        </div>
      </div>

      <aside class="summary panel">
        <h3 class="summary-title">خلاصه سفارش</h3>

        <div class="summary-row">
          <span>تعداد قطعات</span>
          <span>{{ faNum(cart.summary.value.count) }} عدد</span>
        </div>
        <div class="summary-row">
          <span>جمع کالاها</span>
          <span>{{ toman(cart.summary.value.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>هزینه ارسال</span>
          <span :class="{ free: cart.summary.value.shipping === 0 }">
            {{ cart.summary.value.shipping === 0 ? 'رایگان' : toman(cart.summary.value.shipping) }}
          </span>
        </div>

        <div v-if="cart.summary.value.freeShippingRemaining > 0" class="ship-progress">
          <div class="ship-bar"><span :style="{ width: freeShippingPercent + '%' }" /></div>
          <p>
            {{ toman(cart.summary.value.freeShippingRemaining) }} تا ارسال رایگان باقی مانده
          </p>
        </div>

        <div class="summary-total">
          <span>مبلغ قابل پرداخت</span>
          <strong>{{ toman(cart.summary.value.total) }}</strong>
        </div>

        <NuxtLink :to="checkoutTo" class="btn btn-primary btn-block">تکمیل خرید</NuxtLink>
        <p v-if="!user" class="tiny muted center">برای ثبت سفارش ابتدا وارد حساب کاربری می‌شوید.</p>

        <ul class="summary-assurance">
          <li>✓ ضمانت اصالت تمام قطعات</li>
          <li>✓ پرداخت در محل یا درگاه بانکی</li>
          <li>✓ پشتیبانی تلفنی در ساعات کاری</li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding-block: 22px 40px;
}

.crumbs {
  display: flex;
  gap: 7px;
  font-size: 11.5px;
  color: var(--muted-2);
  margin-bottom: 16px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  align-items: start;
}

.cart-items {
  display: grid;
  gap: 10px;
}

.cart-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--panel);
  transition: opacity 0.2s ease;
}

.cart-item.busy {
  opacity: 0.55;
  pointer-events: none;
}

.item-art {
  width: 96px;
  height: 78px;
  border-radius: 9px;
  background: #0b0f14;
  border: 1px solid var(--line-soft);
  padding: 6px;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.item-info {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.item-cat {
  font-size: 10.5px;
  color: var(--accent);
}

.item-name {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.6;
}

.item-name:hover {
  color: #fff;
}

.item-sku {
  font-size: 10px;
  color: var(--muted-2);
}

.item-stock {
  font-size: 10.5px;
  color: var(--muted);
}

.item-stock.in { color: #4bc98c; }
.item-stock.out { color: #ff8d9b; }

.item-qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}

.item-qty button {
  width: 30px;
  height: 32px;
  border: none;
  background: transparent;
  color: #d5dfe9;
  font-size: 15px;
  cursor: pointer;
}

.item-qty button:hover {
  background: rgba(255, 255, 255, 0.06);
}

.item-qty span {
  min-width: 28px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 700;
}

.item-price {
  display: grid;
  gap: 1px;
  text-align: left;
}

.item-price .price {
  font-size: 14px;
}

.item-remove {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--muted-2);
  cursor: pointer;
}

.item-remove:hover {
  color: #ff8d9b;
  border-color: rgba(255, 84, 104, 0.4);
}

.cart-note {
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(74, 168, 255, 0.06);
  border: 1px solid rgba(74, 168, 255, 0.16);
  font-size: 11.5px;
  color: #a9cdf5;
}

.summary {
  position: sticky;
  top: 174px;
  padding: 18px;
  display: grid;
  gap: 11px;
}

.summary-title {
  font-size: 14px;
  font-weight: 800;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
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

.summary-row .free {
  color: #4bc98c;
}

.ship-progress {
  display: grid;
  gap: 5px;
  padding: 9px;
  border-radius: 8px;
  background: rgba(255, 176, 32, 0.06);
  border: 1px solid rgba(255, 176, 32, 0.16);
}

.ship-bar {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.ship-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ffb020, #ff7a2f);
  border-radius: 3px;
}

.ship-progress p {
  font-size: 10.5px;
  color: #ffc55c;
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
  color: #fff;
}

.summary-assurance {
  display: grid;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  font-size: 10.5px;
  color: var(--muted-2);
}

@media (max-width: 960px) {
  .cart-layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}

@media (max-width: 680px) {
  .cart-item {
    grid-template-columns: 76px minmax(0, 1fr) auto;
    grid-template-areas:
      'art info remove'
      'qty price price';
    row-gap: 10px;
  }
  .item-art { grid-area: art; width: 76px; height: 64px; }
  .item-info { grid-area: info; }
  .item-remove { grid-area: remove; align-self: start; }
  .item-qty { grid-area: qty; width: fit-content; }
  .item-price { grid-area: price; text-align: left; align-self: center; }
}
</style>
