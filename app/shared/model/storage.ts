import type { User } from '~/shared/types'

const STORAGE_KEY = 'users_data'

export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: User[] = [
      {
        username: 'ADMIN',
        password: '',
        isBlocked: false,
        hasPasswordRestrictions: false,
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
  }
}

export function getAllUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getUserByUsername(username: string): User | null {
  const users = getAllUsers()
  return users.find(u => u.username === username) || null
}

export function saveUser(user: User): void {
  const users = getAllUsers()
  const index = users.findIndex(u => u.username === user.username)

  if (index !== -1) {
    users[index] = user
  }
  else {
    users.push(user)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function updateUserPassword(username: string, newPassword: string): boolean {
  const user = getUserByUsername(username)
  if (!user) return false

  user.password = newPassword
  saveUser(user)
  return true
}

export function deleteUser(username: string): boolean {
  const users = getAllUsers()
  const filtered = users.filter(u => u.username !== username)

  if (filtered.length === users.length) return false

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}
