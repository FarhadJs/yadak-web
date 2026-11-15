export const toman = (value: number | null | undefined) => {
  const n = Number(value || 0);
  return `${n.toLocaleString('fa-IR')} تومان`;
};

export const faNum = (value: number | string | null | undefined) =>
  Number(value || 0).toLocaleString('fa-IR');

export const faDate = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const faDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const ORDER_STATUS: Record<string, { label: string; tone: string }> = {
  PENDING: { label: 'در انتظار پرداخت', tone: 'warn' },
  PAID: { label: 'پرداخت‌شده', tone: 'info' },
  SHIPPED: { label: 'ارسال‌شده', tone: 'info' },
  DELIVERED: { label: 'تحویل‌شده', tone: 'ok' },
  CANCELED: { label: 'لغو‌شده', tone: 'danger' },
};

export const PAYMENT_LABEL: Record<string, string> = {
  COD: 'پرداخت در محل',
  ONLINE: 'پرداخت آنلاین',
  CARD: 'کارت به کارت',
};

export const statusLabel = (status: string) => ORDER_STATUS[status]?.label || status;
export const statusTone = (status: string) => ORDER_STATUS[status]?.tone || 'info';

export const errorMessage = (error: any, fallback = 'خطایی رخ داد. دوباره تلاش کنید.') => {
  const msg = error?.data?.message ?? error?.data?.error ?? error?.message;
  if (Array.isArray(msg)) return msg[0];
  return typeof msg === 'string' && msg.length ? msg : fallback;
};

export const provinces = [
  'یزد', 'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'کرمان', 'البرز', 'آذربایجان شرقی',
  'آذربایجان غربی', 'خوزستان', 'گیلان', 'مازندران', 'قم', 'مرکزی', 'همدان', 'کرمانشاه',
  'گلستان', 'سیستان و بلوچستان', 'هرمزگان', 'بوشهر', 'اردبیل', 'زنجان', 'قزوین', 'سمنان',
  'کردستان', 'لرستان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'ایلام', 'خراسان شمالی',
  'خراسان جنوبی',
];
