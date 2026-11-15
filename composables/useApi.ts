export const useApi = () => {
  const token = useCookie<string | null>('yk_token');

  const api = <T = any>(path: string, opts: any = {}): Promise<T> => {
    const headers: Record<string, string> = { ...(opts.headers || {}) };
    if (token.value) headers.Authorization = `Bearer ${token.value}`;
    return $fetch<T>(path.startsWith('/api') ? path : `/api${path}`, {
      ...opts,
      headers,
      credentials: 'same-origin',
    });
  };

  return { api };
};
