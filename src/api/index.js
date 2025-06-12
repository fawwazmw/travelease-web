import axios from 'axios';

// Membuat instance Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Mengambil URL dari file .env
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// =================================================================
// Interceptor: Kode yang berjalan SEBELUM setiap request dikirim
// =================================================================
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('accessToken');

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Lakukan sesuatu jika ada error pada konfigurasi request
    return Promise.reject(error);
  }
);


// =================================================================
// Interceptor: Kode yang berjalan SETELAH response diterima
// =================================================================
apiClient.interceptors.response.use(
  (response) => {
    // Jika response sukses (status 2xx), langsung kembalikan response
    return response;
  },
  (error) => {
    // Cek jika error disebabkan karena tidak terautentikasi (token invalid/kadaluarsa)
    if (error.response && error.response.status === 401) {
      // Hapus data autentikasi dari localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Arahkan pengguna kembali ke halaman login
      // Kita gunakan `window.location.href` untuk memastikan reload halaman penuh
      // agar state aplikasi di-reset.
      window.location.href = '/login'; // URL ini akan kita definisikan di router
    }

    // Kembalikan error agar bisa ditangani oleh block .catch() di tempat lain
    return Promise.reject(error);
  }
);


export default apiClient;
