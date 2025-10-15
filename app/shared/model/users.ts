import type { User } from '~/shared/types'

const STORAGE_KEY = 'users_data'
const MAX_ATTEMPTS = 3

const admin: User = {
  username: 'ADMIN',
  password: '',
  isBlocked: false,
  hasPasswordRestrictions: false,
}

export const useUsersStore = defineStore('users', () => {
  const users = useLocalStorage<User[]>(STORAGE_KEY, () => [admin], {
    serializer: {
      read: (data: string) => {
        console.log('read', data)
        const parsed = JSON.parse(data)
        console.log('parsed', parsed)
        return parsed
      },
      write: (data: User[]) => {
        console.log('write', data)
        const parsed = JSON.stringify(data)
        console.log('parsed', parsed)
        return parsed
      },
    },
  })

  const currentUsername = useLocalStorage<string | null>('current_username', null)
  const currentUser = computed(() => currentUsername.value ? users.value.find(u => u.username === currentUsername.value) : null)
  const loginAttempts = ref<Record<string, number>>({})

  const isAdmin = computed(() => currentUser.value?.username === 'ADMIN')

  const getUserByUsername = (username: string) => users.value.find(u => u.username === username) || null

  const login = (username: string, password: string): {
    success: boolean
    message: string
    rateLimited?: boolean
  } => {
    const user = getUserByUsername(username)
    if (!user) return {
      success: false,
      message: 'Пользователь не найден',
    }

    if (user.isBlocked) return {
      success: false,
      message: 'Учетная запись заблокирована',
    }

    if (user.password !== password) {
      loginAttempts.value[username] = (loginAttempts.value[username] || 0) + 1

      if (loginAttempts.value[username] >= MAX_ATTEMPTS) {
        return {
          success: false,
          message: `Превышено количество попыток входа (${MAX_ATTEMPTS})`,
          rateLimited: true,
        }
      }

      return {
        success: false,
        message: `Неверный пароль. Попытка ${loginAttempts.value[username]} из ${MAX_ATTEMPTS}`,
      }
    }

    loginAttempts.value[username] = 0
    currentUsername.value = user.username

    return {
      success: true,
      message: 'Успешный вход',
    }
  }

  const logout = () => {
    currentUsername.value = null
  }

  const addUser = (user: User) => {
    users.value.push(user)
  }

  const updateUser = (user: User) => {
    const index = users.value.findIndex(u => u.username === user.username)
    if (index !== -1) {
      users.value[index] = user
    }
  }

  const deleteUser = (username: string) => {
    const index = users.value.findIndex(u => u.username === username)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  return {
    users,
    currentUser,
    loginAttempts,
    isAdmin,
    getUserByUsername,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
  }
})
