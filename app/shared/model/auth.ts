import type { User, AuthState, LoginAttempt } from '~/shared/types'
import { getUserByUsername } from './storage'

const MAX_ATTEMPTS = 3
const loginAttempts = new Map<string, LoginAttempt>()

export function checkCredentials(
  username: string,
  password: string,
): {
  success: boolean
  message: string
  user?: User
} {
  const user = getUserByUsername(username)

  if (!user) {
    return {
      success: false,
      message: 'Пользователь не найден',
    }
  }

  if (user.isBlocked) {
    return {
      success: false,
      message: 'Учетная запись заблокирована',
    }
  }

  if (user.password !== password) {
    const attempt = loginAttempts.get(username) || { username, attempts: 0 }
    attempt.attempts++
    loginAttempts.set(username, attempt)

    if (attempt.attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        message: `Превышено количество попыток входа (${MAX_ATTEMPTS})`,
      }
    }

    return {
      success: false,
      message: `Неверный пароль. Попытка ${attempt.attempts} из ${MAX_ATTEMPTS}`,
    }
  }

  // Успешный вход - сбрасываем счетчик попыток
  loginAttempts.delete(username)

  return {
    success: true,
    message: 'Успешный вход',
    user,
  }
}

export function getLoginAttempts(username: string): number {
  return loginAttempts.get(username)?.attempts || 0
}

export function resetLoginAttempts(username: string): void {
  loginAttempts.delete(username)
}

export function isAdmin(username: string): boolean {
  return username === 'ADMIN'
}

export function createAuthState(user: User | null): AuthState {
  return {
    currentUser: user,
    isAuthenticated: !!user,
    isAdmin: user ? isAdmin(user.username) : false,
  }
}
