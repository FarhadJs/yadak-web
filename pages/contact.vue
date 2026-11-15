<script setup lang="ts">
const { api } = useApi();
const toast = useToast();
const config = useRuntimeConfig();

usePageSeo('contact', {
  title: 'ارتباط با یدک سیستم | پشتیبانی قطعات MVM در یزد',
  description:
    'راه‌های تماس با یدک سیستم، نمایندگی MVM فلاحی در یزد، برای مشاوره فنی، استعلام قطعه و پیگیری سفارش لوازم یدکی MVM.',
});

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: 'استعلام قطعه',
  body: '',
});

const loading = ref(false);
const sent = ref(false);
const error = ref('');

const subjects = ['استعلام قطعه', 'پیگیری سفارش', 'مشاوره فنی', 'همکاری و نمایندگی', 'انتقاد و پیشنهاد'];

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await api('/api/contact', { method: 'POST', body: { ...form } });
    sent.value = true;
    toast.push('پیام شما ثبت شد. به‌زودی تماس می‌گیریم.');
    form.body = '';
  } catch (err: any) {
    error.value = errorMessage(err, 'ارسال پیام ناموفق بود.');
  } finally {
    loading.value = false;
  }
};

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AutoPartsStore',
        name: 'یدک سیستم — نمایندگی MVM فلاحی',
        url: `${config.public.siteUrl}/contact`,
        telephone: '+983538226600',
        email: 'info@fallahi-mvm.ir',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'بلوار جمهوری اسلامی، جنب پل بازار نو، پلاک ۴۱۲',
          addressLocality: 'یزد',
          addressCountry: 'IR',
        },
        openingHours: 'Sa-Th 08:00-20:00',
      }),
    },
  ],
});
</script>

<template>
  <div class="contact-page">
    <div class="contact-hero">
      <div class="container">
        <span class="eyebrow">پشتیبانی و مشاوره</span>
        <h1 class="display">با ما حرف بزنید</h1>
        <p class="muted">
          برای استعلام قطعه، تأیید سازگاری با خودرو یا پیگیری سفارش، تیم فنی یدک سیستم
          در ساعات کاری پاسخ‌گوی شماست.
        </p>
      </div>
    </div>

    <div class="container contact-layout">
      <div class="contact-info">
        <a href="tel:03538226600" class="info-card">
          <span class="info-icon">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </span>
          <div>
            <small>تلفن فروشگاه</small>
            <strong class="mono">۰۳۵-۳۸۲۲۶۶۰۰</strong>
          </div>
        </a>

        <a href="tel:09131234567" class="info-card">
          <span class="info-icon">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7">
              <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
              <path d="M11 18.5h2" stroke-linecap="round" />
            </svg>
          </span>
          <div>
            <small>موبایل / واتس‌اپ</small>
            <strong class="mono">۰۹۱۳۱۲۳۴۵۶۷</strong>
          </div>
        </a>

        <div class="info-card">
          <span class="info-icon">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
          </span>
          <div>
            <small>آدرس شعبه مرکزی</small>
            <strong>یزد، بلوار جمهوری اسلامی، جنب پل بازار نو، پلاک ۴۱۲</strong>
          </div>
        </div>

        <div class="info-card">
          <span class="info-icon">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <small>ساعات کاری</small>
            <strong>شنبه تا پنجشنبه، ۸:۰۰ تا ۲۰:۰۰</strong>
          </div>
        </div>

        <div class="contact-map">
          <div class="map-grid tech-grid" />
          <span class="map-pin">یدک سیستم</span>
          <p>
            <a href="https://maps.google.com/?q=Yazd+Jomhouri+Blvd" target="_blank" rel="noopener">
              مشاهده مسیر در نقشه ←
            </a>
          </p>
        </div>

        <NuxtLink to="/branches" class="branches-link">مشاهده همه شعب نمایندگی در استان یزد ←</NuxtLink>
      </div>

      <div class="contact-form panel">
        <div class="panel-head">
          <span class="panel-title">فرم تماس و استعلام قطعه</span>
          <span class="badge badge-ok">پاسخ در ساعات کاری</span>
        </div>

        <div class="panel-pad">
          <div v-if="sent" class="sent">
            <h3>پیام شما ثبت شد</h3>
            <p>
              کارشناسان ما در اولین فرصت کاری با شما تماس می‌گیرند. برای موارد فوری می‌توانید
              با شماره ۰۳۵-۳۸۲۲۶۶۰۰ تماس بگیرید.
            </p>
            <button type="button" class="btn btn-outline btn-sm" @click="sent = false">ارسال پیام دیگر</button>
          </div>

          <form v-else class="stack" @submit.prevent="submit">
            <div class="form-grid">
              <div class="field">
                <label for="c-name">نام و نام خانوادگی</label>
                <input id="c-name" v-model="form.name" class="input" type="text" required />
              </div>
              <div class="field">
                <label for="c-phone">شماره تماس</label>
                <input id="c-phone" v-model="form.phone" class="input" type="tel" dir="ltr" required />
              </div>
              <div class="field">
                <label for="c-email">ایمیل (اختیاری)</label>
                <input id="c-email" v-model="form.email" class="input mono" type="email" dir="ltr" />
              </div>
              <div class="field">
                <label for="c-subject">موضوع</label>
                <select id="c-subject" v-model="form.subject" class="select">
                  <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div class="field span-2">
                <label for="c-body">متن پیام / کد فنی قطعه</label>
                <textarea
                  id="c-body"
                  v-model="form.body"
                  class="textarea"
                  placeholder="مثلاً: برای MVM 530 مدل ۱۳۹۹ دیسک ترمز جلو موجود دارید؟"
                  required
                />
              </div>
            </div>

            <p v-if="error" class="error-text">{{ error }}</p>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'در حال ارسال…' : 'ارسال پیام' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  padding-bottom: 50px;
}

.contact-hero {
  padding-block: 40px 30px;
  background: radial-gradient(60% 120% at 85% 0%, rgba(255, 59, 47, 0.14), transparent 65%);
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 26px;
}

.contact-hero .display {
  margin-top: 8px;
  font-size: clamp(30px, 4vw, 46px);
}

.contact-hero p {
  margin-top: 10px;
  max-width: 620px;
  font-size: 13.5px;
}

.contact-layout {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 22px;
  align-items: start;
}

.contact-info {
  display: grid;
  gap: 10px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
}

.info-card small {
  display: block;
  font-size: 10.5px;
  color: var(--muted-2);
}

.info-card strong {
  font-size: 12.5px;
  line-height: 1.9;
}

.info-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--accent-soft);
  color: #ff8d84;
  flex-shrink: 0;
}

.contact-map {
  position: relative;
  height: 190px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: linear-gradient(160deg, #0c1116, #080b0f);
  overflow: hidden;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
}

.map-grid {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  mask-image: radial-gradient(circle at 50% 60%, #000 20%, transparent 78%);
}

.map-pin {
  position: relative;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 12px 30px -10px rgba(255, 59, 47, 0.9);
}

.map-pin::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2px;
  height: 26px;
  background: linear-gradient(var(--accent), transparent);
}

.contact-map p {
  position: absolute;
  bottom: 10px;
  font-size: 11px;
}

.contact-map a {
  color: #9ccbff;
}

.branches-link {
  font-size: 12px;
  color: #ff8d84;
  padding: 4px 2px;
}

.sent {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 20px 0;
}

.sent h3 {
  font-size: 16px;
}

.sent p {
  font-size: 12.5px;
  color: var(--muted);
  line-height: 2;
}

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
}
</style>
