<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'dashboard' });

const { api } = useApi();
const { user, fetchMe } = useAuth();
const toast = useToast();

const profile = reactive({ name: user.value?.name || '', phone: user.value?.phone || '' });
const profileSaving = ref(false);

const passwords = reactive({ currentPassword: '', newPassword: '' });
const passwordSaving = ref(false);

const saveProfile = async () => {
  profileSaving.value = true;
  try {
    await api('/api/auth/profile', { method: 'PATCH', body: { ...profile } });
    await fetchMe();
    toast.push('اطلاعات حساب به‌روزرسانی شد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    profileSaving.value = false;
  }
};

const changePassword = async () => {
  passwordSaving.value = true;
  try {
    await api('/api/auth/change-password', { method: 'POST', body: { ...passwords } });
    passwords.currentPassword = '';
    passwords.newPassword = '';
    toast.push('رمز عبور با موفقیت تغییر کرد.');
  } catch (error: any) {
    toast.push(errorMessage(error), 'error');
  } finally {
    passwordSaving.value = false;
  }
};

useHead({ title: 'اطلاعات حساب | یدک سیستم' });
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <span class="eyebrow">تنظیمات حساب</span>
        <h1 class="h2">اطلاعات حساب کاربری</h1>
      </div>
    </div>

    <div class="profile-grid">
      <section class="panel panel-pad">
        <h3 class="block-title">مشخصات</h3>
        <form class="stack" @submit.prevent="saveProfile">
          <div class="field">
            <label for="p-name">نام و نام خانوادگی</label>
            <input id="p-name" v-model="profile.name" class="input" type="text" required />
          </div>
          <div class="field">
            <label for="p-phone">شماره موبایل</label>
            <input id="p-phone" v-model="profile.phone" class="input" type="tel" dir="ltr" />
          </div>
          <div class="field">
            <label for="p-email">ایمیل</label>
            <input id="p-email" :value="user?.email" class="input mono" type="email" dir="ltr" disabled />
            <span class="tiny muted">ایمیل حساب قابل تغییر نیست.</span>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="profileSaving">
            {{ profileSaving ? 'در حال ذخیره…' : 'ذخیره تغییرات' }}
          </button>
        </form>
      </section>

      <section class="panel panel-pad">
        <h3 class="block-title">تغییر رمز عبور</h3>
        <form class="stack" @submit.prevent="changePassword">
          <div class="field">
            <label for="p-current">رمز عبور فعلی</label>
            <input id="p-current" v-model="passwords.currentPassword" class="input" type="password" autocomplete="current-password" required />
          </div>
          <div class="field">
            <label for="p-new">رمز عبور جدید</label>
            <input id="p-new" v-model="passwords.newPassword" class="input" type="password" autocomplete="new-password" minlength="6" required />
          </div>
          <button type="submit" class="btn btn-outline" :disabled="passwordSaving">
            {{ passwordSaving ? 'در حال تغییر…' : 'تغییر رمز عبور' }}
          </button>
        </form>

        <div class="profile-note">
          <strong>نکته امنیتی</strong>
          <p class="tiny muted">
            برای حفظ امنیت حساب، از رمزهای تکراری استفاده نکنید. در صورت فراموشی رمز، با
            پشتیبانی نمایندگی تماس بگیرید.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 18px; }

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}

.block-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);
}

.profile-note {
  margin-top: 18px;
  padding: 12px;
  border-radius: 9px;
  background: rgba(74, 168, 255, 0.06);
  border: 1px solid rgba(74, 168, 255, 0.16);
}

.profile-note strong {
  font-size: 11.5px;
  color: #9ccbff;
}

.profile-note p {
  margin-top: 3px;
  line-height: 1.9;
}

@media (max-width: 860px) {
  .profile-grid { grid-template-columns: 1fr; }
}
</style>
