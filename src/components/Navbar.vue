<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav v-if="authStore.isLoggedIn">
        <div class="nav-left">
          <RouterLink class="brand" to="/">TravelEase</RouterLink>
          <RouterLink to="/destinations">Destinasi</RouterLink>
          <RouterLink to="/my-bookings">Booking Saya</RouterLink>
        </div>
        <div class="nav-right">
          <span class="user-name">Halo, {{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </nav>

      <nav v-else>
        <div class="nav-left">
          <RouterLink class="brand" to="/">TravelEase</RouterLink>
          <RouterLink to="/destinations">Destinasi</RouterLink>
        </div>
        <div class="nav-right">
          <RouterLink to="/login" class="btn-secondary">Login</RouterLink>
          <RouterLink to="/register" class="btn-primary">Daftar</RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 0 2rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 65px;
  display: flex;
  align-items: center;
}

.wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}
.brand:hover {
  color: var(--color-primary);
}

nav a {
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover, nav a.router-link-exact-active {
  color: var(--color-primary);
}

.user-name {
  font-weight: 600;
}

/* Base button style */
.btn-primary, .btn-secondary, .btn-logout {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

.btn-logout {
  background-color: var(--color-error);
  color: var(--color-text-light);
}
</style>
