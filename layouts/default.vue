<script setup lang="ts">
const { token, user, fetchMe } = useAuth();

if (!user.value && token.value) {
  await fetchMe();
}

if (user.value) {
  const cart = useCart();
  const wishlist = useWishlist();
  await Promise.all([cart.load(), wishlist.load()]);
}
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="app-main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
