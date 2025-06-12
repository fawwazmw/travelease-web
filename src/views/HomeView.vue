<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';

const router = useRouter();

// State untuk menyimpan data dari form dan API
const categories = ref([]);
const selectedCategory = ref('');
const searchTerm = ref('');

// State untuk loading dan error
const isLoading = ref(false);
const error = ref(null);

// Fungsi untuk mengambil data kategori dari API
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get('/categories');
    // Kita ambil 'data'-nya karena API Resource Laravel membungkusnya
    categories.value = response.data.data;
  } catch (err) {
    error.value = 'Gagal memuat kategori.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Fungsi untuk menangani submit form pencarian
const handleSearch = () => {
  const query = {};
  if (searchTerm.value) {
    query.search = searchTerm.value;
  }
  if (selectedCategory.value) {
    // Backend kita menggunakan slug untuk filter kategori
    query.category_slug = selectedCategory.value;
  }

  // Arahkan ke halaman destinations dengan membawa query filter
  router.push({
    name: 'destinations',
    query: query
  });
};

// Jalankan fetchCategories saat komponen pertama kali dimuat
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>Temukan Destinasi Impian Anda</h1>
      <p>Jelajahi keindahan Indonesia bersama TravelEase</p>

      <form @submit.prevent="handleSearch" class="search-form">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Cari nama destinasi..."
          class="search-input"
        />
        <select v-model="selectedCategory" class="category-select">
          <option value="">Semua Kategori</option>
          <option v-if="isLoading" value="">Memuat...</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">
            {{ category.name }}
          </option>
        </select>
        <button type="submit" class="btn-primary">Cari</button>
      </form>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 65px); /* 65px adalah tinggi navbar */
  text-align: center;
}

.hero-section {
  max-width: 600px;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.search-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.search-input, .category-select {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 1rem;
}

.search-input {
  flex-grow: 1;
}

.btn-primary {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: var(--color-primary);
  color: var(--color-text-light);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
