export default defineNuxtRouteMiddleware(async (to) => {
  const { token, user, fetchMe } = useAuth();

  if (!token.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  if (!user.value) {
    await fetchMe();
  }
  if (!user.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  if (user.value.role !== 'ADMIN') {
    return navigateTo('/account');
  }
});
