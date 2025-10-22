import { useUsersStore } from '~/shared/model/users'

export default defineNuxtRouteMiddleware((to) => {
  const usersStore = useUsersStore()

  if (to.path !== '/' && !usersStore.currentUser) {
    return '/'
  }
  else if (to.path === '/' && usersStore.currentUser) {
    return '/profile'
  }
})
