<script setup lang="ts">
import { ru } from '@nuxt/ui/locale'
import { z } from 'zod'
import { useUsersStore } from './shared/model/users'

const usersStore = useUsersStore()
const router = useRouter()

z.config(z.locales.ru())

function handleLogout() {
  usersStore.logout()

  router.push('/')
}
</script>

<template>
  <UApp :locale="ru">
    <UHeader title="<>">
      <template #right>
        <UPopover v-if="usersStore.currentUser">
          <ULink to="/profile">
            {{ usersStore.currentUser.username }}
          </ULink>
          <template #content>
            <UButton
              color="error"
              variant="soft"
              @click="handleLogout"
            >
              Выйти
            </UButton>
          </template>
        </UPopover>
      </template>
      <template #toggle>
        {{ '' }}
      </template>
    </UHeader>
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
