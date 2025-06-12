<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/api';
import ReviewForm from '@/components/ReviewForm.vue';

// Setup 'essentials'
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State untuk data dari API
const destination = ref(null);
const reviews = ref([]);
const slots = ref([]);

// State untuk UI (loading, error)
const isLoading = ref(true);
const error = ref(null);

// State untuk form booking
const bookingData = ref({
  visit_date: '',
  num_tickets: 1,
  slot_id: null,
});
const isBooking = ref(false);
const bookingError = ref('');

// Fungsi ini akan dipanggil dari komponen anak
const handleReviewSubmitted = () => {
  // Kita panggil ulang fungsi fetchReviews untuk mendapatkan data terbaru
  fetchReviews();
};

// Tambahkan juga fungsi fetchReviews terpisah agar bisa dipanggil ulang
const fetchReviews = async () => {
  const slug = route.params.slug;
  try {
    const reviewsRes = await apiClient.get(`/destinations/${slug}/reviews`);
    reviews.value = reviewsRes.data.data;
  } catch (err) {
    console.error("Gagal memuat ulang review:", err);
  }
}

// Fungsi untuk mengambil semua data yang dibutuhkan untuk halaman ini
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  const slug = route.params.slug;

  try {
    const [destinationRes, slotsRes] = await Promise.all([
      apiClient.get(`/destinations/${slug}`),
      apiClient.get(`/destinations/${slug}/slots`),
    ]);
    destination.value = destinationRes.data.data;
    slots.value = slotsRes.data.data;
    await fetchReviews(); // Panggil fetchReviews di sini

  } catch (err) {
    error.value = 'Gagal memuat detail destinasi. Mungkin destinasi tidak ditemukan.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Fungsi untuk menangani submit form booking
const handleBooking = async () => {
  if (!authStore.isLoggedIn) {
    // Jika belum login, arahkan ke halaman login
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }

  isBooking.value = true;
  bookingError.value = '';

  try {
    const payload = {
      destination_id: destination.value.id,
      visit_date: bookingData.value.visit_date,
      num_tickets: bookingData.value.num_tickets,
      slot_id: bookingData.value.slot_id,
    };

    await apiClient.post('/bookings', payload);

    alert('Pemesanan berhasil!'); // Notifikasi sederhana
    router.push({ name: 'my-bookings' }); // Arahkan ke halaman riwayat booking

  } catch (err) {
    bookingError.value = err.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.';
    // Handle error validasi
    if (err.response?.data?.errors) {
      bookingError.value = Object.values(err.response.data.errors)[0][0];
    }
  } finally {
    isBooking.value = false;
  }
};

// Panggil fetchData saat komponen dimuat
onMounted(fetchData);
</script>

<template>
  <div class="detail-container">
    <div v-if="isLoading" class="loading-state">
      <p>Memuat detail destinasi...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="destination" class="content-wrapper">
      <div class="main-content">
        <h1>{{ destination.name }}</h1>
        <p class="category-location">{{ destination.category?.name }} • {{ destination.location_address }}</p>

        <div class="image-gallery">
          <img :src="destination.main_image_url" :alt="destination.name" class="main-image">
        </div>

        <h3>Deskripsi</h3>
        <p>{{ destination.description }}</p>

        <hr>

        <h3>Ulasan Pengunjung ({{ destination.total_reviews }})</h3>
        <div v-if="reviews.length > 0" class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <strong>{{ review.user.name }}</strong> (⭐{{ review.rating }})
            <p>"{{ review.comment }}"</p>
          </div>
        </div>
        <p v-else>Belum ada ulasan untuk destinasi ini.</p>
      </div>

      <div class="review-submission-section">
        <h3>Beri Ulasan Anda</h3>
        <div v-if="authStore.isLoggedIn">
          <ReviewForm
            :destination-id="destination.id"
            @review-submitted="handleReviewSubmitted"
          />
        </div>
        <div v-else class="login-prompt">
          <p>Anda harus login untuk dapat memberikan ulasan.</p>
          <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="btn-primary">
            Login untuk Beri Ulasan
          </RouterLink>
        </div>
      </div>

      <aside class="sidebar-content">
        <div class="booking-card">
          <div class="price-info">
            Mulai dari <span class="price">Rp {{ new Intl.NumberFormat('id-ID').format(destination.ticket_price) }}</span> / orang
          </div>

          <div v-if="!authStore.isLoggedIn" class="login-prompt">
            <p>Anda harus login untuk dapat memesan tiket.</p>
            <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="btn-primary">Login untuk Memesan</RouterLink>
          </div>

          <form v-else @submit.prevent="handleBooking">
            <h4>Pesan Tiket Anda</h4>
            <div class="input-group">
              <label for="visit_date">Tanggal Kunjungan</label>
              <input type="date" id="visit_date" v-model="bookingData.visit_date" required>
            </div>
            <div class="input-group">
              <label for="num_tickets">Jumlah Tiket</label>
              <input type="number" id="num_tickets" v-model="bookingData.num_tickets" min="1" required>
            </div>
            <div class="input-group" v-if="slots.length > 0">
              <label for="slot">Pilih Sesi/Slot</label>
              <select id="slot" v-model="bookingData.slot_id">
                <option :value="null">Pilih sesi jika tersedia</option>
                <option v-for="slot in slots" :key="slot.id" :value="slot.id">
                  {{ slot.start_time }} - {{ slot.end_time }} (Sisa: {{ slot.available_capacity }})
                </option>
              </select>
            </div>
            <p v-if="bookingError" class="error-msg">{{ bookingError }}</p>
            <button type="submit" class="btn-primary" :disabled="isBooking">
              {{ isBooking ? 'Memproses...' : 'Pesan Sekarang' }}
            </button>
          </form>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: flex-start;
}
.main-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.category-location {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}
.main-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}
h3 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2rem 0;
}
.review-item {
  background: var(--color-background);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.review-item p {
  margin-top: 0.5rem;
  color: var(--color-text-muted);
  font-style: italic;
}
.booking-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: sticky;
  top: 90px; /* 65px navbar + 25px margin */
}
.price-info {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}
.login-prompt {
  text-align: center;
  padding: 1rem;
}
.btn-primary {
  width: 100%;
  padding: 0.8rem;
}
.input-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
input, select {
  width: 100%;
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
.error-msg {
  color: var(--color-error);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
