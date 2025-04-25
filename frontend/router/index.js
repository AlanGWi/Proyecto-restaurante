import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'

const routes = [

  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/pedidos',
    name: 'pedidos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PedidosMenu.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/agregar',
    name: 'agregar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AgregarMenu.vue')
  },
  {
    path: '/editar/:id',
    name: 'editar',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EditarMenu.vue')
  },
  {
    path: '/carrito/:ids',
    name: 'carrito',
    component: () => import( '../views/CarritoView.vue')
  },

  {
    path: '/estadistica',
    name: 'estadistica',
    component: () => import( '../views/EstadisticasView.vue')
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: () => import( '../views/LoginForgot.vue')
  },

  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/LoginRegister.vue')
  },


  {
    path: '/deshabilitados',
    name: 'deshabilitados',
    component: () => import( '../views/ProDeshabilitados.vue')
  },

  {
    path: '/pago',
    name: 'pago',
    component: () => import( '../views/PagoView.vue')
  },

  {
    path: '/confirmacion', // Agregar la nueva ruta para confirmar el pago
    name: 'confirmacion',
    component: () => import('../views/ConfirmacionView.vue')
  }
  
  
]

const router = createRouter({
  history: createWebHistory(), // Cambiar a createWebHistory
  routes
});

export default router
