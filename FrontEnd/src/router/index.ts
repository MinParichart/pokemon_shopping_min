import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import AuthLayout from '../layouts/AuthLayout.vue';
import UserLayout from '../layouts/UserLayout.vue';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('../views/AuthView.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'admin-login',
        component: () => import('../views/LoginAdminView.vue'),
      },
    ],
  },

  {
    path: '/',
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'products',
        name: 'user-products',
        component: () => import('../views/UserProductsListView.vue'),
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../views/CartView.vue'),
      },
      {
        path: 'my-orders',
        name: 'my-orders',
        component: () => import('../views/MyOrdersView.vue'),
      },
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('../views/OrdersView.vue'),
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('../views/AdminProductsListView.vue'),
      },
      {
        path: 'products/new',
        name: 'admin-product-create',
        component: () => import('../views/ProductFormView.vue'),
      },
      {
        path: 'products/:id/edit',
        name: 'admin-product-edit',
        props: true,
        component: () => import('../views/ProductFormView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.payload && auth.token) {
    auth.initFromToken();
  }

  const isLoggedIn = auth.isAuthenticated;

  if (to.meta.requiresAuth && !isLoggedIn) {
    // แยก redirect สำหรับ user กับ admin
    if (to.matched.some((m) => m.path.startsWith('/admin'))) {
      return next({ name: 'admin-login', query: { redirect: to.fullPath } });
    }
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: 'user-products' });
  }

  if ((to.name === 'login' || to.name === 'admin-login') && isLoggedIn) {
    if (auth.isAdmin) return next({ name: 'admin-orders' });
    return next({ name: 'user-products' });
  }

  next();
});

export default router;
