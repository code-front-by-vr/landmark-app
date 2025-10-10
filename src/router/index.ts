import { createRouter, createWebHistory } from 'vue-router';
import { ROUTES } from './routes';
import { getCurrentUser } from '@/services/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTES,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth) {
    return next();
  }

  const user = await getCurrentUser();

  if (user) {
    next();
  } else {
    next('/sign-in');
  }
});

export default router;
