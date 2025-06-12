<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-badge"></div>
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-text"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-line {
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-badge {
  width: 30%;
  height: 20px;
}

.skeleton-title {
  width: 70%;
  height: 24px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
}

/* Animasi Shimmer */
.skeleton-image, .skeleton-line {
  background-image: linear-gradient(90deg, #e0e0e0 0px, #f5f5f5 40px, #e0e0e0 80px);
  background-size: 600px;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
</style>
