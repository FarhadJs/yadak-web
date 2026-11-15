<script setup lang="ts">
const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
        <span class="toast-dot" />
        <span class="toast-msg">{{ t.message }}</span>
        <button type="button" class="toast-x" aria-label="بستن" @click="dismiss(t.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  bottom: 22px;
  left: 22px;
  z-index: 200;
  display: grid;
  gap: 9px;
  max-width: min(360px, calc(100vw - 32px));
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 11px;
  background: #0e141a;
  border: 1px solid var(--line);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.95);
  font-size: 12.5px;
  line-height: 1.8;
}

.toast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--ok);
}

.toast.error .toast-dot { background: var(--danger); }
.toast.warn .toast-dot { background: var(--accent-2); }
.toast.info .toast-dot { background: var(--info); }

.toast.error { border-color: rgba(255, 84, 104, 0.35); }
.toast.warn { border-color: rgba(255, 176, 32, 0.32); }

.toast-msg { flex: 1; }

.toast-x {
  border: none;
  background: transparent;
  color: var(--muted-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 560px) {
  .toasts { left: 12px; right: 12px; bottom: 12px; max-width: none; }
}
</style>
