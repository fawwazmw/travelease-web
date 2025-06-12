import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DestinationsView from '../views/DestinationsView.vue'
import DestinationDetailView from '../views/DestinationDetailView.vue'
import MyBookingsView from '../views/MyBookingsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/destinations',
      name: 'destinations',
      component: DestinationsView
    },
    {
      // ':slug' adalah parameter dinamis.
      // Nantinya akan kita gunakan untuk memuat destinasi berdasarkan slug-nya.
      path: '/destination/:slug',
      name: 'destination-detail',
      component: DestinationDetailView
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: MyBookingsView,
      meta: { requiresAuth: true } // <-- TAMBAHKAN INI
    },
    {
      // Ini adalah route "catch-all" untuk halaman 404
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

// ===============================================
//         NAVIGATION GUARD (SANGAT PENTING)
// ===============================================
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Jika rute tujuan memerlukan autentikasi DAN pengguna belum login
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Arahkan pengguna ke halaman login
    next({ name: 'login' })
  }
  // Jika pengguna sudah login dan mencoba mengakses halaman login/register
  else if ((to.name === 'login' || to.name === 'register') && authStore.isLoggedIn) {
    // Arahkan ke halaman utama
    next({ name: 'home' })
  }
  // Jika semua kondisi di atas tidak terpenuhi, biarkan navigasi berjalan
  else {
    next()
  }
})

export default router
