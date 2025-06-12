<script setup>
import { ref } from 'vue';
import apiClient from '@/api';

// Komponen ini menerima 'destinationId' sebagai properti
const props = defineProps({
  destinationId: {
    type: String,
    required: true,
  }
});

// Komponen ini akan mengirim event 'review-submitted' jika berhasil
const emit = defineEmits(['review-submitted']);

// State untuk data form
const rating = ref(0);
const comment = ref('');

// State untuk UI
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  if (rating.value === 0) {
    errorMessage.value = 'Rating bintang wajib diisi.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const payload = {
      destination_id: props.destinationId,
      rating: rating.value,
      comment: comment.value,
    };

    const response = await apiClient.post('/reviews', payload);
    successMessage.value = response.data.message || 'Ulasan berhasil dikirim!';

    // Reset form
    rating.value = 0;
    comment.value = '';

    // Kirim event ke parent untuk memberitahu bahwa ada ulasan baru
    emit('review-submitted');

  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="review-form-card">
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label>Rating Anda</label>
        <div class="star-rating">
          <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= rating }" @click="rating = star">
            ★
          </span>
        </div>
      </div>

      <div class="input-group">
        <label for="comment">Ulasan Anda (Opsional)</label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          placeholder="Bagikan pengalaman Anda di sini..."
        ></textarea>
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>

      <button type="submit" class="btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Mengirim...' : 'Kirim Ulasan' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.review-form-card {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-top: 2rem;
}

.input-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.star:hover,
.star.filled {
  color: #ffc107; /* Warna bintang kuning */
}

textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
}

.error-msg {
  color: var(--color-error);
  margin-bottom: 1rem;
  font-weight: 500;
}

.success-msg {
  color: #065f46; /* Hijau tua */
  margin-bottom: 1rem;
  font-weight: 500;
}
</style>
