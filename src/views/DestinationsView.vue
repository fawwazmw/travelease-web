<script setup>
// 1. Impor tambahan untuk router dan komponen Pagination
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import DestinationCard from '@/components/DestinationCard.vue';
import Pagination from '@/components/Pagination.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';

const route = useRoute();
const router = useRouter();

const destinations = ref([]);
const pagination = ref({});
const isLoading = ref(false);
const error = ref(null);

const fetchDestinations = async (queryParams) => {
  isLoading.value = true;
  error.value = null;
  destinations.value = [];
  try {
    const response = await apiClient.get('/destinations', { params: queryParams });
    destinations.value = response.data.data;
    pagination.value = response.data.meta; // 'meta' berisi info paginasi
  } catch (err) {
    error.value = 'Gagal memuat destinasi.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// 2. Fungsi untuk menangani event page-change dari komponen Pagination
const handlePageChange = (page) => {
  router.push({ query: { ...route.query, page: page } });
};

// 'watch' akan memantau perubahan pada query URL.
// Jika URL berubah (misal: dari pencarian baru atau klik paginasi), fungsi ini akan berjalan lagi.
watch(
  () => route.query,
  (newQuery) => {
    fetchDestinations(newQuery);
  },
  { immediate: true }
);
</script>

<template>
  <div class="destinations-container">
    <h2>Hasil Pencarian Destinasi</h2>

    <div v-if="isLoading" class="grid-container">
      <SkeletonCard v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <TransitionGroup
      v-else-if="destinations.length > 0"
      name="list"
      tag="div"
      class="grid-container"
    >
      <DestinationCard
        v-for="destination in destinations"
        :key="destination.id"
        :destination="destination"
      />
    </TransitionGroup>

    <div v-else class="empty-state">
      <p>Destinasi tidak ditemukan. Coba dengan kata kunci atau filter lain.</p>
    </div>

    <Pagination
      v-if="!isLoading && pagination.last_page > 1"
      :meta="pagination"
      @page-change="handlePageChange"
    />

  </div>
</template>

<style scoped>
.destinations-container {
  padding: 2rem 0;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-muted);
}

/* Transisi untuk list */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
