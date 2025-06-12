<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

// State untuk data form
const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

// State untuk UI
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessages = ref({}); // Gunakan objek untuk error per-field

const handleRegister = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessages.value = {};

  try {
    const response = await authStore.register(formData.value);
    successMessage.value = response.message;
    // Kosongkan form setelah berhasil
    formData.value = { name: '', email: '', password: '', password_confirmation: '' };

    // Arahkan ke halaman login setelah 3 detik
    setTimeout(() => {
      router.push({ name: 'login' });
    }, 3000);

  } catch (error) {
    if (error.errors) {
      // Jika ada error validasi dari Laravel (status 422)
      errorMessages.value = error.errors;
    } else {
      // Error umum lainnya
      errorMessages.value = { general: [error.message || 'Terjadi kesalahan saat registrasi.'] };
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Buat Akun Baru</h2>

      <div v-if="successMessage" class="success-box">
        <p>{{ successMessage }}</p>
        <p>Anda akan diarahkan ke halaman login...</p>
      </div>

      <form v-else @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="name">Nama Lengkap</label>
          <input type="text" id="name" v-model="formData.name" placeholder="Masukkan nama lengkap" required />
          <p v-if="errorMessages.name" class="error-msg-field">{{ errorMessages.name[0] }}</p>
        </div>

        <div class="input-group">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="formData.email" placeholder="contoh@email.com" required />
          <p v-if="errorMessages.email" class="error-msg-field">{{ errorMessages.email[0] }}</p>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="formData.password" placeholder="Minimal 8 karakter" required />
          <p v-if="errorMessages.password" class="error-msg-field">{{ errorMessages.password[0] }}</p>
        </div>

        <div class="input-group">
          <label for="password_confirmation">Konfirmasi Password</label>
          <input type="password" id="password_confirmation" v-model="formData.password_confirmation" placeholder="Ulangi password" required />
        </div>

        <p v-if="errorMessages.general" class="error-msg-field">{{ errorMessages.general[0] }}</p>

        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Mendaftar...' : 'Daftar' }}
        </button>
      </form>

      <div class="auth-switch">
        <p>Sudah punya akun? <RouterLink to="/login">Login di sini</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menggunakan style yang sama dengan LoginView untuk konsistensi */
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
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
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-msg-field {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--color-primary);
  color: var(--color-text-light);
  transition: background-color 0.3s ease;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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

.success-box {
  text-align: center;
  padding: 1rem;
  border: 1px solid #10B981;
  background-color: #F0FDFA;
  color: #047857;
  border-radius: 8px;
}

</style>
