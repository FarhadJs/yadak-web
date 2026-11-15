export const useApi = () => {
  const token = useCookie<string | null>('yk_token');
  const config = useRuntimeConfig();
  const base = String(config.public.apiBase || '').replace(/\/+$/, '');

  /** آدرس کامل API؛ در استقرار جداگانه، فرانت و بک روی دو دامنه هستند */
  const apiUrl = (path: string) => {
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.startsWith('/api')
      ? path
      : `/api${path.startsWith('/') ? path : `/${path}`}`;
    return `${base}${clean}`;
  };

  const api = <T = any>(path: string, opts: any = {}): Promise<T> => {
    const headers: Record<string, string> = { ...(opts.headers || {}) };
    if (token.value) headers.Authorization = `Bearer ${token.value}`;
    return $fetch<T>(apiUrl(path), {
      ...opts,
      headers,
      credentials: 'omit',
    });
  };

  /** آدرس کامل تصویر؛ در استقرار دو‌هاستی تصاویر از دامنه API می‌آیند */
  const assetUrl = (url?: string | null) => {
    if (!url) return '';
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
  };

  return { api, apiUrl, assetUrl };
};
