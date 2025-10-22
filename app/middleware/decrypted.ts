import { useUsersStore } from '~/shared/model/users'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/decrypt' && !useUsersStore().isDecrypted) {
    return '/decrypt'
  }
})
