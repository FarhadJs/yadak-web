export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'ADMIN' | 'CUSTOMER';
}

export const useAuth = () => {
  const token = useCookie<string | null>('yk_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  const user = useState<AuthUser | null>('auth:user', () => null);
  const { api } = useApi();

  const fetchMe = async () => {
    if (!token.value) {
      user.value = null;
      return null;
    }
    try {
      user.value = await api<AuthUser>('/api/auth/me');
    } catch {
      token.value = null;
      user.value = null;
    }
    return user.value;
  };

  const login = async (email: string, password: string) => {
    const res = await api<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    token.value = res.token;
    user.value = res.user;
    const cart = useCart();
    await cart.syncAfterLogin();
    return res.user;
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    const res = await api<{ token: string; user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
    token.value = res.token;
    user.value = res.user;
    const cart = useCart();
    await cart.syncAfterLogin();
    return res.user;
  };

  const logout = async () => {
    token.value = null;
    user.value = null;
    const cart = useCart();
    cart.resetLocal();
    const wishlist = useWishlist();
    wishlist.ids.value = [];
    await navigateTo('/');
  };

  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  return { token, user, isAdmin, fetchMe, login, register, logout };
};
