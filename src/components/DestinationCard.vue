<script setup>
import { RouterLink } from 'vue-router';

// Menerima 'destination' sebagai properti dari komponen induk
defineProps({
  destination: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <RouterLink :to="{ name: 'destination-detail', params: { slug: destination.slug } }" class="card-link">
    <div class="destination-card">
      <img :src="destination.main_image_url" :alt="destination.name" class="card-image" />
      <div class="card-content">
        <span class="category-badge">{{ destination.category?.name || 'Uncategorized' }}</span>
        <h3 class="card-title">{{ destination.name }}</h3>
        <div class="card-footer">
          <span class="rating">⭐ {{ destination.average_rating }}</span>
          <span class="price">Rp {{ new Intl.NumberFormat('id-ID').format(destination.ticket_price) }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}
.destination-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-content {
  padding: 1rem;
}
.category-badge {
  background-color: rgba(68, 109, 255, 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.75rem 0;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
.rating {
  font-weight: 600;
}
.price {
  font-weight: 700;
  color: var(--color-primary);
}
</style>
