export interface User {
  username: string
  password: string
  isBlocked: boolean
  hasPasswordRestrictions: boolean
  needPasswordChange?: boolean
}

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isAdmin: boolean
}

export interface LoginAttempt {
  username: string
  attempts: number
}
