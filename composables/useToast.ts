type ToastType = 'success' | 'error' | 'info' | 'warn';

export const useToast = () => {
  const toasts = useState<{ id: number; message: string; type: ToastType }[]>('toasts', () => []);

  const push = (message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 999);
    toasts.value = [...toasts.value, { id, message, type }];
    if (import.meta.client) {
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, 4000);
    }
  };

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, push, dismiss };
};
