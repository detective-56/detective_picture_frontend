import ACCESS_ENUM from '@/access/accessEnum'

const checkAccess = (loginUser: any, needAccess: string = ACCESS_ENUM.NOT_LOGIN) => {
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }
  // 如果用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户没登录， 那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false
    }
  }

  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果不为管理员表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false
    }
  }
  return true
}

export default checkAccess
