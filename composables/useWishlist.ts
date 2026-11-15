export const useWishlist = () => {
  const { api } = useApi();
  const { user } = useAuth();
  const ids = useState<string[]>('wishlist:ids', () => []);
  const items = useState<any[]>('wishlist:items', () => []);
  const toast = useToast();

  const load = async () => {
    if (!user.value) {
      ids.value = [];
      items.value = [];
      return;
    }
    try {
      const list = await api<any[]>('/api/wishlist');
      items.value = list;
      ids.value = list.map((p) => p.id);
    } catch {
      ids.value = [];
    }
  };

  const has = (productId: string) => ids.value.includes(productId);

  const toggle = async (productId: string) => {
    if (!user.value) {
      toast.push('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.', 'warn');
      await navigateTo('/login?redirect=/account/wishlist');
      return false;
    }
    const res = await api<{ inWishlist: boolean }>(`/api/wishlist/${productId}`, { method: 'POST' });
    ids.value = res.inWishlist
      ? [...ids.value, productId]
      : ids.value.filter((id) => id !== productId);
    await load();
    toast.push(
      res.inWishlist ? 'محصول به علاقه‌مندی‌ها اضافه شد.' : 'محصول از علاقه‌مندی‌ها حذف شد.',
      res.inWishlist ? 'success' : 'info',
    );
    return res.inWishlist;
  };

  const remove = async (productId: string) => {
    await api(`/api/wishlist/${productId}`, { method: 'DELETE' });
    ids.value = ids.value.filter((id) => id !== productId);
    items.value = items.value.filter((p) => p.id !== productId);
  };

  return { ids, items, has, load, toggle, remove };
};
