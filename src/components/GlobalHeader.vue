<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/ylogo.png" alt="logo" />
            <div class="title">智能云图库</div>
          </div>
        </RouterLink>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="menus1"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <ASpace>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </ASpace>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { AppstoreOutlined, HomeOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons-vue'
import { type MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/service/api/userController'
import checkAccess from '@/access/checkAccess'

const router = useRouter()

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

const originalItems = [
  {
    key: '/',
    icon: () => h(MailOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManager',
    icon: () => h(AppstoreOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/about',
    icon: () => h(AppstoreOutlined),
    label: '关于',
    title: '关于',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片'
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
  },
]
// 获取登录用户
const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()

const doLogout = async () => {
  const res = await userLogoutUsingPost()
  console.log(res)
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败' + res.data.message)
  }
}

// 通过全局配置权限 过滤菜单项
// 1. 把菜单项转为路由项
const routeToMenuItem = (item: any) => {
  return {
    key: item.path,
    label: item.name,
    title: item.name,
    icon: item.path === '/' ? h(item.meta?.icon ?? HomeOutlined) : undefined,
  }
}

const menus = computed<MenuProps['items']>(() => {
  return router
    .getRoutes()
    .filter((item) => {
      if (item.meta?.hideInMenu) {
        return false
      }
      // 根据权限过滤菜单， 有权限则返回true, 则保留菜单
      return checkAccess(loginUserStore.loginUser, item.meta?.access as string)
    })
    .map(routeToMenuItem)
})

const routeMap = new Map(
  router.getRoutes().map((item) => {
    return [item.path, item]
  }),
)

const menus1 = computed<MenuProps['items']>(() => {
  return originalItems.filter((menu) => {
    const item = routeMap.get(menu.key)
    console.log(item)
    if (item === undefined || item.meta?.hideInMenu) {
      console.log(item)
      return false
    }
    return checkAccess(loginUserStore.loginUser, item.meta?.access as string)
  })
})
console.log(menus1.value)
// const items1 = menus.filter((menu) => {
//   // todo 需要自己实现menu 到 item 的转化
//   const item = menuToRouteItem(menu)
//   if (item.meta?.hideInMenu) {
//     return false
//   }
//   // 根据权限过滤菜单， 有权限则返回 true, 则保留菜单
//   return checkAccess(loginUserStore.loginUser, item.meta?.access as string)
// })

// 过滤菜单项 不带全局配置
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if ((menu?.key as any).startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}
// const items = computed<MenuProps['items']>(() => filterMenus(originalItems))
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
