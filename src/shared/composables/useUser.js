import { computed, ref } from 'vue'
import { getStorage, removeStorage, setStorage } from '../../storage/index.js'

const USERS_KEY = 'shopping_users'
const CURRENT_USER_KEY = 'shopping_current_user'

const users = ref(getStorage(USERS_KEY, []))
const currentUser = ref(getStorage(CURRENT_USER_KEY, null))

function saveUsers() {
  setStorage(USERS_KEY, users.value)
}

function saveCurrentUser() {
  setStorage(CURRENT_USER_KEY, currentUser.value)
}

function createUser(username, password) {
  return {
    id: `user_${Date.now()}`,
    username,
    password,
    phone: '',
    address: '',
  }
}

export function useUser() {
  const isLoggedIn = computed(() => currentUser.value !== null)

  function register(username, password) {
    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password) {
      return {
        success: false,
        message: '用户名和密码不能为空',
      }
    }

    const existedUser = users.value.find((user) => user.username === trimmedUsername)

    if (existedUser) {
      return {
        success: false,
        message: '用户名已存在',
      }
    }

    const newUser = createUser(trimmedUsername, password)
    users.value.push(newUser)
    saveUsers()

    return {
      success: true,
      message: '注册成功',
      user: newUser,
    }
  }

  function login(username, password) {
    const trimmedUsername = username.trim()

    const matchedUser = users.value.find((user) => {
      return user.username === trimmedUsername && user.password === password
    })

    if (!matchedUser) {
      return {
        success: false,
        message: '用户名或密码错误',
      }
    }

    currentUser.value = matchedUser
    saveCurrentUser()

    return {
      success: true,
      message: '登录成功',
      user: matchedUser,
    }
  }

  function updateProfile(profileData) {
    if (!currentUser.value) {
      return {
        success: false,
        message: '请先登录',
      }
    }

    const targetUser = users.value.find((user) => user.id === currentUser.value.id)

    if (!targetUser) {
      return {
        success: false,
        message: '未找到当前用户',
      }
    }

    Object.assign(targetUser, profileData)
    currentUser.value = { ...targetUser }
    saveUsers()
    saveCurrentUser()

    return {
      success: true,
      message: '收货信息已更新',
      user: currentUser.value,
    }
  }

  function logout() {
    currentUser.value = null
    removeStorage(CURRENT_USER_KEY)
  }

  return {
    currentUser,
    isLoggedIn,
    register,
    login,
    updateProfile,
    logout,
  }
}
