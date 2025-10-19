export const ROUTES = [
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/GeneralMap.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'landmark/:id',
        name: 'landmark-detail',
        component: () => import('@/views/LandmarkDetail.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'sign-in',
        name: 'sign-in',
        component: () => import('@/views/SignIn.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/Register.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/ForgotPassword.vue'),
      },
    ],
  },
];
