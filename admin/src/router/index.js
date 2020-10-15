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
    path: '/login',
    name: 'Login',
    component: ()=> import('../views/Login.vue')
  },
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

      {
        path: 'articles/create',
        name: 'ArticleCreate',
        component: () => import('../views/ArticleEdit.vue')
      },
      {
        path: 'articles/list',
        name: 'ArticleList',
        component: () => import('../views/ArticleList.vue')
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        props: true,
        component: () => import('../views/ArticleEdit.vue')
      },

      {
        path: 'ads/create',
        name: 'AdCreate',
        component: () => import('../views/AdEdit.vue')
      },
      {
        path: 'ads/list',
        name: 'AdList',
        component: () => import('../views/AdList.vue')
      },
      {
        path: 'ads/edit/:id',
        name: 'AdEdit',
        props: true,
        component: () => import('../views/AdEdit.vue')
      },

      {
        path: 'admin_users/create',
        name: 'AdminUserCreate',
        component: () => import('../views/AdminUserEdit.vue')
      },
      {
        path: 'admin_users/list',
        name: 'AdminUserList',
        component: () => import('../views/AdminUserList.vue')
      },
      {
        path: 'admin_users/edit/:id',
        name: 'AdminUserEdit',
        props: true,
        component: () => import('../views/AdminUserEdit.vue')
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
