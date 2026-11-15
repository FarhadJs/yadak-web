export const FREE_SHIPPING_THRESHOLD = 5_000_000;
export const SHIPPING_COST = 145_000;

const emptySummary = () => ({
  count: 0,
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  freeShippingRemaining: FREE_SHIPPING_THRESHOLD,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
});

const summaryOf = (items: { lineTotal: number; qty: number }[]) => {
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = count === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return {
    count,
    subtotal,
    shipping,
    discount: 0,
    total: subtotal + shipping,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };
};

const brief = (p: any) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  sku: p.sku,
  price: Number(p.price),
  stock: Number(p.stock),
  inStock: Number(p.stock) > 0,
  unit: p.unit,
  art: p.art,
  image: p.image || null,
  category: p.category || null,
});

/**
 * سبد برگشتی از API، آیتم‌ها را با شناسه ردیف (`id`) می‌فرستد؛ کل رابط کاربری
 * با `key` کار می‌کند. اینجا هر دو یکی می‌شوند تا حذف/تغییر تعداد برای کاربر
 * واردشده هم مثل سبد مهمان کار کند.
 */
const normalizeServerCart = (cart: any) => {
  const items = (cart?.items || []).map((item: any) => {
    const product = item.product || {};
    const stock = Number(product.stock ?? 0);
    const qty = Number(item.qty ?? 0);
    return {
      ...item,
      key: item.key || item.id,
      qty,
      lineTotal: Number(item.lineTotal ?? Number(product.price ?? 0) * qty),
      product: {
        ...product,
        price: Number(product.price ?? 0),
        stock,
        inStock: product.inStock ?? stock > 0,
      },
    };
  });
  return { items, summary: cart?.summary || emptySummary() };
};

export const useCart = () => {
  const { api } = useApi();
  const { user } = useAuth();
  const lines = useCookie<{ productId: string; qty: number }[]>('yk_cart', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    default: () => [],
  });
  const state = useState<any>('cart:state', () => ({ items: [], summary: emptySummary() }));
  const busy = useState('cart:busy', () => false);

  const localLines = computed(() => (Array.isArray(lines.value) ? lines.value : []));
  const count = computed(() =>
    user.value ? state.value.summary.count : localLines.value.reduce((s, l) => s + Number(l.qty || 0), 0),
  );
  const items = computed(() => state.value.items || []);

  const hydrateLocal = async () => {
    const saved = localLines.value.filter((l) => l.qty > 0);
    if (!saved.length) {
      state.value = { items: [], summary: emptySummary() };
      return;
    }
    const ids = saved.map((l) => l.productId).join(',');
    const products = await api<any[]>(`/api/products/by-ids?ids=${encodeURIComponent(ids)}`).catch(() => []);
    const next: any[] = [];
    for (const line of saved) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) continue;
      const qty = Math.max(1, Math.min(Number(line.qty), Number(product.stock) || 1));
      next.push({
        key: product.id,
        qty,
        lineTotal: Number(product.price) * qty,
        product: brief(product),
      });
    }
    state.value = { items: next, summary: summaryOf(next) };
    lines.value = next.map((i) => ({ productId: i.product.id, qty: i.qty }));
  };

  const load = async () => {
    if (user.value) {
      try {
        state.value = normalizeServerCart(await api('/api/cart'));
      } catch {
        state.value = { items: [], summary: emptySummary() };
      }
      return;
    }
    await hydrateLocal();
  };

  const add = async (product: any, qty = 1) => {
    busy.value = true;
    try {
      if (user.value) {
        state.value = normalizeServerCart(
          await api('/api/cart/items', {
            method: 'POST',
            body: { productId: product.id, qty },
          }),
        );
      } else {
        const existing = localLines.value.find((l) => l.productId === product.id);
        const max = Math.max(1, Number(product.stock) || 1);
        const next = existing
          ? localLines.value.map((l) =>
              l.productId === product.id ? { ...l, qty: Math.min(max, Number(l.qty) + qty) } : l,
            )
          : [...localLines.value, { productId: product.id, qty: Math.min(max, qty) }];
        lines.value = next;
        await hydrateLocal();
      }
      return true;
    } finally {
      busy.value = false;
    }
  };

  const setQty = async (key: string, qty: number) => {
    busy.value = true;
    try {
      if (user.value) {
        state.value = normalizeServerCart(
          await api(`/api/cart/items/${key}`, {
            method: 'PATCH',
            body: { qty },
          }),
        );
      } else {
        lines.value =
          qty <= 0
            ? localLines.value.filter((l) => l.productId !== key)
            : localLines.value.map((l) => (l.productId === key ? { ...l, qty } : l));
        await hydrateLocal();
      }
    } finally {
      busy.value = false;
    }
  };

  const remove = async (key: string) => {
    busy.value = true;
    try {
      if (user.value) {
        state.value = normalizeServerCart(await api(`/api/cart/items/${key}`, { method: 'DELETE' }));
      } else {
        lines.value = localLines.value.filter((l) => l.productId !== key);
        await hydrateLocal();
      }
    } finally {
      busy.value = false;
    }
  };

  const clear = async () => {
    if (user.value) {
      state.value = normalizeServerCart(await api('/api/cart', { method: 'DELETE' }));
    } else {
      lines.value = [];
      state.value = { items: [], summary: emptySummary() };
    }
  };

  const syncAfterLogin = async () => {
    const guest = localLines.value.filter((l) => l.qty > 0);
    if (!guest.length) {
      await load();
      return;
    }
    try {
      state.value = normalizeServerCart(
        await api('/api/cart/merge', {
          method: 'POST',
          body: { items: guest.map((l) => ({ productId: l.productId, qty: l.qty })) },
        }),
      );
      lines.value = [];
    } catch {
      // در صورت خطا سبد مهمان حفظ می‌شود
    }
  };

  const resetLocal = () => {
    lines.value = [];
    state.value = { items: [], summary: emptySummary() };
  };

  return { items, summary: computed(() => state.value.summary), count, busy, load, add, setQty, remove, clear, syncAfterLogin, resetLocal };
};
