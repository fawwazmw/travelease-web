<script setup>
import { computed } from 'vue';

const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['page-change']);

const changePage = (page) => {
  // Pastikan tidak pindah ke halaman yang tidak valid
  if (page < 1 || page > props.meta.last_page) {
    return;
  }
  emit('page-change', page);
};

// Logika untuk menampilkan nomor halaman (misal: 1 ... 4, 5, 6 ... 10)
const pages = computed(() => {
  const last = props.meta.last_page;
  const current = props.meta.current_page;
  const range = [];

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - 2 && i <= current + 2)) {
      range.push(i);
    }
  }

  const withDots = [];
  let lastVal = 0;
  for (const val of range) {
    if (val !== lastVal + 1) {
      withDots.push('...');
    }
    withDots.push(val);
    lastVal = val;
  }
  return withDots;
});
</script>

<template>
  <nav class="pagination-nav" aria-label="Pagination">
    <button
      class="page-item"
      @click="changePage(meta.current_page - 1)"
      :disabled="meta.current_page === 1"
    >
      &laquo; Previous
    </button>

    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === '...'" class="page-item dots">...</span>
      <button
        v-else
        class="page-item"
        :class="{ 'active': page === meta.current_page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="page-item"
      @click="changePage(meta.current_page + 1)"
      :disabled="meta.current_page === meta.last_page"
    >
      Next &raquo;
    </button>
  </nav>
</template>

<style scoped>
.pagination-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-item {
  padding: 0.5rem 0.75rem;
  min-width: 38px;
  text-align: center;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-item.dots {
  border-color: transparent;
  background-color: transparent;
  cursor: default;
}

.page-item:hover:not(:disabled):not(.active):not(.dots) {
  background-color: rgba(68, 109, 255, 0.1);
}

.page-item:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.page-item.active {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border-color: var(--color-primary);
  font-weight: 700;
}
</style>
