import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'


// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'categories/create',
        name: 'CategoryCreate',
        component: () => import('../views/CategoryEdit.vue')
      },
      {
        path: 'categories/list',
        name: 'CategoryList',
        component: () => import('../views/CategoryList.vue')
      },
      {
        path: 'categories/edit/:id',
        name: 'CategoryEdit',
        props: true,
        component: () => import('../views/CategoryEdit.vue')
      },
      {
        path: 'items/create',
        name: 'ItemCreate',
        component: () => import('../views/ItemEdit.vue')
      },
      {
        path: 'items/list',
        name: 'ItemList',
        component: () => import('../views/ItemList.vue')
      },
      {
        path: 'items/edit/:id',
        name: 'ItemEdit',
        props: true,
        component: () => import('../views/ItemEdit.vue')
      },
      {
        path: 'heros/create',
        name: 'HeroCreate',
        component: () => import('../views/HeroEdit.vue')
      },
      {
        path: 'heros/list',
        name: 'HeroList',
        component: () => import('../views/HeroList.vue')
      },
      {
        path: 'heros/edit/:id',
        name: 'HeroEdit',
        props: true,
        component: () => import('../views/HeroEdit.vue')
      },
      {
        path: 'heros/detail/:id',
        name: 'HeroDetail',
        props: true,
        component: () => import('../views/HeroEdit.vue')
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
