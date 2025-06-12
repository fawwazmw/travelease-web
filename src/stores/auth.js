// src/stores/auth.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/index.js' // Mengimpor apiClient kita

export const useAuthStore = defineStore('auth', () => {
  // === STATE ===
  // Mengambil data dari localStorage saat pertama kali store dibuat.
  // Ini membuat status login tetap ada meskipun halaman di-refresh.
  const token = ref(localStorage.getItem('accessToken'))
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const router = useRouter()

  // === GETTERS ===
  // Computed property untuk mengecek apakah pengguna sudah login.
  // Komponen lain bisa menggunakan ini untuk menampilkan/menyembunyikan elemen.
  const isLoggedIn = computed(() => !!token.value)

  // === ACTIONS ===

  /**
   * Mengatur data token dan user, baik di state maupun di localStorage.
   * @param {string|null} newToken
   * @param {object|null} newUser
   */
  function setData(newToken, newUser) {
    if (newToken) {
      localStorage.setItem('accessToken', newToken)
      token.value = newToken
    } else {
      localStorage.removeItem('accessToken')
      token.value = null
    }

    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
      user.value = newUser
    } else {
      localStorage.removeItem('user')
      user.value = null
    }
  }

  /**
   * Menangani proses login.
   * @param {object} credentials - { email, password }
   */
  async function login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials)
      const responseData = response.data

      // Simpan token dan data user menggunakan action setData
      setData(responseData.access_token, responseData.user)

      // Arahkan ke halaman utama setelah login berhasil
      await router.push('/')

      return responseData
    } catch (error) {
      // Hapus sisa data jika login gagal
      setData(null, null)
      // Lemparkan error agar bisa ditangani di komponen
      throw error.response.data
    }
  }

  /**
   * Menangani proses registrasi.
   * @param {object} userData - { name, email, password, password_confirmation }
   */
  async function register(userData) {
    try {
      // Panggil endpoint register di API
      const response = await apiClient.post('/register', userData);
      // Jika berhasil, kembalikan data response (berisi pesan sukses)
      return response.data;
    } catch (error) {
      // Jika gagal, lemparkan error agar bisa ditangkap dan ditampilkan di form
      throw error.response.data;
    }
  }

  /**
   * Menangani proses logout.
   */
  async function logout() {
    try {
      // Panggil endpoint logout di backend untuk menghapus token di server
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Gagal logout di server, tapi tetap lanjut logout di client.", error.response.data);
    } finally {
      // Selalu hapus data di client tidak peduli response server
      setData(null, null)
      // Arahkan ke halaman login
      await router.push('/login')
    }
  }

  // Expose state, getters, dan actions agar bisa digunakan di komponen
  return { token, user, isLoggedIn, login, register, logout }
})
