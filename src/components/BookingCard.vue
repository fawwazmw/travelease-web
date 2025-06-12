<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// Komponen ini menerima 'booking' sebagai properti dan 'emit' untuk mengirim event ke parent
const props = defineProps({
  booking: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['cancel-booking']);

// Fungsi untuk mendapatkan kelas CSS berdasarkan status booking
const statusClass = computed(() => {
  switch (props.booking.status) {
    case 'confirmed':
    case 'completed':
      return 'status-success';
    case 'pending':
      return 'status-warning';
    case 'cancelled':
    case 'failed':
      return 'status-danger';
    default:
      return 'status-secondary';
  }
});

// Fungsi yang akan dipanggil saat tombol batal diklik
const onCancelClick = () => {
  if (confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
    emit('cancel-booking', props.booking.id);
  }
};
</script>

<template>
  <div class="booking-card">
    <div class="card-image-wrapper">
      <img :src="booking.destination?.main_image_url" :alt="booking.destination?.name" class="dest-image" />
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="destination-name">{{ booking.destination?.name }}</h3>
        <span :class="['status-badge', statusClass]">{{ booking.status }}</span>
      </div>
      <p class="booking-code">Kode Booking: <strong>{{ booking.booking_code }}</strong></p>
      <div class="booking-details">
        <p><strong>Tanggal Kunjungan:</strong> {{ booking.visit_date }}</p>
        <p><strong>Jumlah Tiket:</strong> {{ booking.num_tickets }} orang</p>
        <p><strong>Total Harga:</strong> Rp {{ new Intl.NumberFormat('id-ID').format(booking.total_price) }}</p>
      </div>
      <div class="card-actions">
        <RouterLink :to="{ name: 'destination-detail', params: { slug: booking.destination?.slug } }" class="btn-secondary">
          Lihat Destinasi
        </RouterLink>
        <button v-if="booking.status === 'pending' || booking.status === 'confirmed'" @click="onCancelClick" class="btn-danger">
          Batalkan
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  display: flex;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.card-image-wrapper {
  flex-shrink: 0;
  width: 200px;
}
.dest-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.destination-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
.booking-code {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.booking-details p {
  margin: 0.25rem 0;
}
.card-actions {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
  align-self: flex-end;
}

/* Status Badge Styles */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-success { background-color: #d1fae5; color: #065f46; }
.status-warning { background-color: #fef3c7; color: #92400e; }
.status-danger { background-color: #fee2e2; color: #991b1b; }
.status-secondary { background-color: #e5e7eb; color: #374151; }

/* Button Styles */
.btn-secondary, .btn-danger {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  font-size: 0.9rem;
}
.btn-secondary { color: var(--color-primary); border-color: var(--color-primary); }
.btn-secondary:hover { background-color: var(--color-primary); color: var(--color-text-light); }
.btn-danger { background-color: var(--color-error); border-color: var(--color-error); color: var(--color-text-light); }
.btn-danger:hover { opacity: 0.8; }
</style>
