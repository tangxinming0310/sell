import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    name: 'goods',
    component: () => import('@/components/goods/goods.vue')
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: () => import('@/components/ratings/ratings.vue')
  },
  {
    path: '/seller',
    name: 'seller',
    component: () => import('@/components/seller/seller.vue')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

export default router
