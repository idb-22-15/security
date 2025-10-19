import type { User } from '~/shared/types'
import { decryptData, encryptData } from './crypto'

const STORAGE_KEY = 'users_data'
const MAX_ATTEMPTS = 3

const defaultAdmin: User = {
  username: 'ADMIN',
  password: '',
  isBlocked: false,
  hasPasswordRestrictions: false,
  needPasswordChange: true,
}

export const useUsersStore = defineStore('users', () => {
  const users = shallowRef<User[]>([])
  const passphrase = ref<string | null>(null)
  const isDecrypted = computed(() => passphrase.value !== null)

  const currentUsername = useLocalStorage<string | null>('current_username', null)
  const currentUser = computed(() => currentUsername.value ? users.value.find(u => u.username === currentUsername.value) : null)
  const loginAttempts = ref<Record<string, number>>({})

  const isAdmin = computed(() => currentUser.value?.username === 'ADMIN')

  const getUserByUsername = (username: string) => users.value.find(u => u.username === username) || null

  const login = (username: string, password: string): {
    success: boolean
    message: string
    rateLimited?: true
    needPasswordChange?: boolean
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
      needPasswordChange: user.needPasswordChange,
    }
  }

  const logout = () => {
    currentUsername.value = null
  }

  const addUser = (user: User) => {
    users.value = [...users.value, user]
    encryptUsers()
  }

  const updateUser = (user: User) => {
    users.value = users.value.map(u => u.username === user.username ? user : u)
    encryptUsers()
  }

  const deleteUser = (username: string) => {
    users.value = users.value.filter(u => u.username !== username)
    encryptUsers()
  }

  const decryptUsers = (passphrase_: string) => {
    let storage = localStorage.getItem(STORAGE_KEY)

    if (!storage) {
      const defaultStorage = encryptData(JSON.stringify([defaultAdmin]), passphrase_)
      localStorage.setItem(STORAGE_KEY, defaultStorage)
      storage = defaultStorage
      console.log('create default storage')
    }

    const decrypted = decryptData(storage, passphrase_)
    if (!decrypted.success) return decrypted

    console.log('decrypted', decrypted)

    try {
      const decryptedUsers = JSON.parse(decrypted.data) as User[]

      const admin = decryptedUsers.find(u => u.username === 'ADMIN')

      if (!admin) return {
        success: false as const,
        message: 'Неверная парольная фраза 1',
      }

      users.value = decryptedUsers
      passphrase.value = passphrase_

      return {
        success: true as const,
      }
    }
    catch {
      return {
        success: false as const,
        message: 'Неверная парольная фраза 2',
      }
    }
  }

  const encryptUsers = () => {
    if (passphrase.value === null) throw Error('Passphrase is not set')

    const encrypted = encryptData(JSON.stringify(users.value), passphrase.value)
    localStorage.setItem(STORAGE_KEY, encrypted)
  }

  return {
    users,
    currentUser,
    loginAttempts,
    isAdmin,
    isDecrypted,

    getUserByUsername,

    login,
    logout,

    addUser,
    updateUser,
    deleteUser,

    decryptUsers,
    encryptUsers,
  }
})
