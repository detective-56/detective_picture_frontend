import { createRouter, createWebHistory } from 'vue-router'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum'
import HelloWorld from '@/components/HelloWorld.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },

    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManager',
      name: '用户管理',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      },
    },
    {
      path: '/about',
      name: '关于',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/noAuth',
      name: '无权限页面',
      component: HelloWorld,
      meta: {
        hideInMenu: false,
      },
    },
  ],
})

export default router
