import { createRouter, createWebHistory } from 'vue-router'
import { getStorage } from '../storage/index.js'
import CartPage from '../views/CartPage.vue'
import CheckoutPage from '../views/CheckoutPage.vue'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import OrderDetailPage from '../views/OrderDetailPage.vue'
import OrderListPage from '../views/OrderListPage.vue'
import PaymentSuccessPage from '../views/PaymentSuccessPage.vue'
import ProductDetailPage from '../views/ProductDetailPage.vue'
import ProductListPage from '../views/ProductListPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ReviewPage from '../views/ReviewPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductListPage,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailPage,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderListPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: OrderDetailPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/review/:orderId',
    name: 'Review',
    component: ReviewPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const currentUser = getStorage('shopping_current_user', null)

  if (to.meta.requiresAuth && !currentUser) {
    return '/login'
  }

  return true
})

export default router
