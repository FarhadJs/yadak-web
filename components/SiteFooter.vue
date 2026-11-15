<script setup lang="ts">
const { data: categories } = await useAsyncData('nav:categories', () => $fetch<any[]>('/api/categories'), {
  default: () => [],
});
const year = 1404;
</script>

<template>
  <footer class="site-footer">
    <div class="footer-trust">
      <div class="container trust-grid">
        <div class="trust-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
            <path d="M9 12l2 2 4-4" stroke-linecap="round" />
          </svg>
          <div>
            <strong>ضمانت اصالت کالا</strong>
            <span>تمام قطعات با گارانتی نمایندگی</span>
          </div>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
            <circle cx="7" cy="18" r="1.8" />
            <circle cx="18" cy="18" r="1.8" />
          </svg>
          <div>
            <strong>ارسال سریع و مطمئن</strong>
            <span>تهران و یزد ۲۴ ساعته، سراسر ایران</span>
          </div>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7">
            <rect x="2.5" y="5" width="19" height="14" rx="3" />
            <path d="M2.5 10h19M6 15h4" stroke-linecap="round" />
          </svg>
          <div>
            <strong>پرداخت امن</strong>
            <span>درگاه بانکی، کارت به کارت یا در محل</span>
          </div>
        </div>
        <div class="trust-item">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7">
            <path d="M4 5h16v11H8l-4 4z" />
            <path d="M8 10h8M8 13h4" stroke-linecap="round" />
          </svg>
          <div>
            <strong>مشاوره فنی رایگان</strong>
            <span>پیدا کردن قطعه با کد VIN خودرو</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container footer-main">
      <div class="footer-brand">
        <div class="brand">
          <span class="brand-mark">
            <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#ff3b2f" stroke-width="3" />
              <circle cx="24" cy="24" r="7" fill="#ff3b2f" />
              <path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#ffb020" stroke-width="3" stroke-linecap="round" />
            </svg>
          </span>
          <strong>یدک سیستم</strong>
        </div>
        <p class="footer-desc">
          فروشگاه تخصصی لوازم یدکی MVM در استان یزد و نمایندگی MVM فلاحی؛ تأمین قطعات اصلی و OEM برای مدل‌های
          315، 530، 550، 110، X22، X33 و X55 با مشاوره فنی و ضمانت اصالت.
        </p>
        <div class="footer-contact">
          <a href="tel:03538226600">۰۳۵-۳۸۲۲۶۶۰۰</a>
          <span>بلوار جمهوری اسلامی، جنب پل بازار نو، یزد</span>
        </div>
      </div>

      <div class="footer-col">
        <h4>دسترسی سریع</h4>
        <NuxtLink to="/">صفحه اصلی</NuxtLink>
        <NuxtLink to="/products">فروشگاه قطعات</NuxtLink>
        <NuxtLink to="/branches">شعب نمایندگی</NuxtLink>
        <NuxtLink to="/contact">ارتباط با ما</NuxtLink>
        <NuxtLink to="/cart">سبد خرید</NuxtLink>
      </div>

      <div class="footer-col">
        <h4>دسته‌بندی قطعات</h4>
        <NuxtLink v-for="cat in categories.slice(0, 5)" :key="cat.id" :to="`/category/${cat.slug}`">
          {{ cat.name }}
        </NuxtLink>
      </div>

      <div class="footer-col">
        <h4>حساب کاربری</h4>
        <NuxtLink to="/login">ورود</NuxtLink>
        <NuxtLink to="/register">ثبت‌نام</NuxtLink>
        <NuxtLink to="/account">داشبورد کاربری</NuxtLink>
        <NuxtLink to="/account/orders">پیگیری سفارش</NuxtLink>
        <NuxtLink to="/account/wishlist">علاقه‌مندی‌ها</NuxtLink>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© {{ year }} یدک سیستم — نمایندگی MVM فلاحی در یزد. تمامی حقوق محفوظ است.</p>
      <p class="footer-note">قیمت‌ها به تومان است و ممکن است بدون اطلاع قبلی تغییر کند.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 60px;
  border-top: 1px solid var(--line);
  background: linear-gradient(180deg, #0a0e13, #060809);
}

.footer-trust {
  border-bottom: 1px solid var(--line-soft);
  padding-block: 22px;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 11px;
  color: #ff9a91;
}

.trust-item svg {
  flex-shrink: 0;
}

.trust-item strong {
  display: block;
  font-size: 12.5px;
  color: #e8eef5;
}

.trust-item span {
  font-size: 11px;
  color: var(--muted-2);
}

.footer-main {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 34px;
  padding-block: 44px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.brand strong {
  font-size: 18px;
  font-weight: 900;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: #0d1218;
  border: 1px solid var(--line);
}

.footer-desc {
  font-size: 12.5px;
  line-height: 2;
  color: var(--muted);
  max-width: 380px;
}

.footer-contact {
  display: grid;
  gap: 5px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--muted-2);
}

.footer-contact a {
  font-family: var(--mono);
  font-size: 15px;
  color: #fff;
  font-weight: 700;
}

.footer-col {
  display: grid;
  align-content: start;
  gap: 9px;
}

.footer-col h4 {
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 4px;
  color: #fff;
}

.footer-col a {
  font-size: 12.5px;
  color: var(--muted);
  width: fit-content;
}

.footer-col a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-block: 18px;
  border-top: 1px solid var(--line-soft);
  font-size: 11.5px;
  color: var(--muted-2);
}

@media (max-width: 980px) {
  .trust-grid { grid-template-columns: 1fr 1fr; }
  .footer-main { grid-template-columns: 1fr 1fr; gap: 26px; }
}

@media (max-width: 560px) {
  .trust-grid { grid-template-columns: 1fr; gap: 12px; }
  .footer-main { grid-template-columns: 1fr; }
  .footer-bottom { justify-content: center; text-align: center; }
}
</style>
