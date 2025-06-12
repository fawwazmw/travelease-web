<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <Navbar />
  <main>
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
header {
  background-color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  width: 100vw;
  /* Memastikan header berada di atas dan tidak terpengaruh margin #app */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

/* Style untuk link yang sedang aktif */
nav a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}

main {
  /* Beri padding atas agar konten tidak tertutup header */
  padding-top: 65px;
}

/* Style untuk transisi fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
