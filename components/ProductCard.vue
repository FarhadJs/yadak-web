<script setup lang="ts">
const props = defineProps<{ product: any }>();

const cart = useCart();
const wishlist = useWishlist();
const toast = useToast();

const adding = ref(false);

const addToCart = async () => {
  if (!props.product.inStock) {
    toast.push('این قطعه فعلاً موجود نیست.', 'warn');
    return;
  }
  adding.value = true;
  try {
    await cart.add(props.product, 1);
    toast.push(`«${props.product.name}» به سبد خرید اضافه شد.`);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    adding.value = false;
  }
};

const toggleWish = async () => {
  try {
    await wishlist.toggle(props.product.id);
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  }
};
</script>

<template>
  <article class="pcard">
    <div class="pcard-media">
      <NuxtLink :to="`/products/${product.slug}`" :aria-label="product.name" class="pcard-art tech-grid">
        <img v-if="product.image" :src="product.image" :alt="product.name" class="pcard-img" loading="lazy" decoding="async" />
        <PartArt v-else :kind="product.art" :label="product.name" />
      </NuxtLink>

      <span v-if="product.discountPercent" class="pcard-off">{{ faNum(product.discountPercent) }}٪</span>
      <span v-else-if="product.badge" class="pcard-badge">{{ product.badge }}</span>

      <button
        type="button"
        class="pcard-heart"
        :class="{ active: wishlist.has(product.id) }"
        :aria-label="wishlist.has(product.id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
        :aria-pressed="wishlist.has(product.id)"
        @click.prevent="toggleWish"
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      </button>
    </div>

    <div class="pcard-body">
      <div class="pcard-meta">
        <span class="pcard-cat">{{ product.category?.name || 'قطعات MVM' }}</span>
        <span class="pcard-sku mono">{{ product.sku }}</span>
      </div>

      <NuxtLink :to="`/products/${product.slug}`" class="pcard-title">{{ product.name }}</NuxtLink>

      <div class="pcard-models">
        <span v-for="m in product.models.slice(0, 2)" :key="m.id" class="tag">{{ m.name }}</span>
        <span v-if="product.models.length > 2" class="tag">+{{ faNum(product.models.length - 2) }}</span>
      </div>

      <div class="pcard-foot">
        <div class="pcard-price">
          <span v-if="product.comparePrice" class="price-old">{{ toman(product.comparePrice) }}</span>
          <span class="price">{{ toman(product.price) }}</span>
        </div>

        <button
          type="button"
          class="pcard-add"
          :disabled="adding || !product.inStock"
          :aria-label="'افزودن ' + product.name + ' به سبد خرید'"
          @click="addToCart"
        >
          <svg v-if="!adding" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
          <span v-else class="spinner" />
        </button>
      </div>

      <div class="pcard-stock" :class="product.inStock ? 'in' : 'out'">
        <span class="dot" />
        {{ product.inStock ? `موجود در انبار (${faNum(product.stock)} ${product.unit})` : 'ناموجود' }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.pcard {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.pcard:hover {
  border-color: #35404f;
  transform: translateY(-3px);
  box-shadow: 0 26px 50px -34px rgba(0, 0, 0, 1);
}

.pcard-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.pcard-media {
  position: relative;
  aspect-ratio: 4 / 3;
  background:
    radial-gradient(70% 70% at 50% 45%, rgba(255, 59, 47, 0.09), transparent 70%),
    #0b0f14;
  border-bottom: 1px solid var(--line-soft);
  overflow: hidden;
}

.pcard-art {
  display: block;
  width: 100%;
  height: 100%;
  padding: 18px 26px;
  transition: transform 0.35s ease;
}

.pcard:hover .pcard-art {
  transform: scale(1.04);
}

.pcard-off {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 11.5px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
}

.pcard-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(7, 9, 12, 0.85);
  border: 1px solid rgba(255, 176, 32, 0.35);
  color: #ffc55c;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.pcard-heart {
  position: absolute;
  top: 9px;
  left: 9px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: rgba(8, 11, 15, 0.75);
  color: #96a1b0;
  cursor: pointer;
  transition: color 0.16s ease, border-color 0.16s ease;
}

.pcard-heart:hover {
  color: #ff8d9b;
  border-color: rgba(255, 84, 104, 0.45);
}

.pcard-heart.active {
  color: #ff5468;
  border-color: rgba(255, 84, 104, 0.55);
  background: rgba(255, 84, 104, 0.12);
}

.pcard-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 15px 15px;
  flex: 1;
}

.pcard-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
}

.pcard-cat {
  color: var(--accent);
  font-weight: 600;
}

.pcard-sku {
  color: var(--muted-2);
  font-size: 10.5px;
}

.pcard-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.65;
  min-height: 46px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pcard-title:hover {
  color: #fff;
}

.pcard-models {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  min-height: 24px;
}

.pcard-models .tag {
  font-size: 10.5px;
  padding: 1px 7px;
}

.pcard-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 6px;
}

.pcard-price {
  display: grid;
  gap: 1px;
}

.pcard-price .price {
  font-size: 15.5px;
}

.pcard-price .price-old {
  font-size: 11.5px;
}

.pcard-add {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 9px;
  background: var(--accent-soft);
  color: #ff7c72;
  border: 1px solid rgba(255, 59, 47, 0.28);
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;
}

.pcard-add:hover {
  background: var(--accent);
  color: #fff;
}

.pcard-add:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pcard-stock {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted-2);
}

.pcard-stock .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.pcard-stock.in {
  color: #4bc98c;
}

.pcard-stock.out {
  color: #ff7c86;
}
</style>
