<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/api';
import BookingCard from '@/components/BookingCard.vue';

const bookings = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Mengambil data booking milik user
const fetchMyBookings = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get('/bookings');
    bookings.value = response.data.data;
  } catch (err) {
    error.value = 'Gagal memuat riwayat pemesanan.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Menangani event pembatalan dari komponen anak (BookingCard)
const handleCancelBooking = async (bookingId) => {
  try {
    await apiClient.post(`/bookings/${bookingId}/cancel`);

    // Cari booking di dalam array dan update statusnya secara lokal
    const index = bookings.value.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings.value[index].status = 'cancelled';
    }

    alert('Pemesanan berhasil dibatalkan.');
  } catch (err) {
    alert('Gagal membatalkan pemesanan: ' + (err.response?.data?.message || 'Error tidak diketahui'));
  }
};

// Panggil fetchMyBookings saat halaman dimuat
onMounted(fetchMyBookings);
</script>

<template>
  <div class="container">
    <h2>Riwayat Pemesanan Saya</h2>

    <div v-if="isLoading" class="state-info">
      <p>Memuat data...</p>
    </div>

    <div v-else-if="error" class="state-info error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="bookings.length > 0">
      <BookingCard
        v-for="booking in bookings"
        :key="booking.id"
        :booking="booking"
        @cancel-booking="handleCancelBooking"
      />
    </div>

    <div v-else class="state-info">
      <p>Anda belum memiliki riwayat pemesanan.</p>
      <RouterLink to="/destinations" class="btn-primary">Cari Destinasi Sekarang</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}
.state-info {
  text-align: center;
  padding: 4rem;
  background: var(--color-surface);
  border-radius: 12px;
  color: var(--color-text-muted);
}
.state-info.error {
  color: var(--color-error);
}
.btn-primary {
  margin-top: 1rem;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: var(--color-text-light);
}
</style>
