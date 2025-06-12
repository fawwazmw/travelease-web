<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = ''; // Reset pesan error
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    // Navigasi sudah dihandle di dalam action login
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan saat login.';
    if (error.errors) {
      // Menampilkan error validasi pertama dari Laravel
      errorMessage.value = Object.values(error.errors)[0][0];
    }
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Login ke Akun Anda</h2>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="contoh@email.com"
            required
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Masukkan password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary">Login</button>
      </form>
      <div class="auth-switch">
        <p>Belum punya akun? <RouterLink to="/register">Daftar di sini</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.auth-box {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-msg {
  color: #e74c3c;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--color-primary); /* Menggunakan variabel warna */
  color: var(--color-text-light); /* Menggunakan variabel warna */
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-switch a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}
</style>
