import { useUsersStore } from '~/shared/model/users'

export default defineNuxtRouteMiddleware(() => {
  if (useUsersStore().currentUser?.needPasswordChange) {
    return '/change-password'
  }
})
