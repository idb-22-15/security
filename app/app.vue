<script setup lang="ts">
import { ru } from '@nuxt/ui/locale'
import { z } from 'zod'
import { useUsersStore } from './shared/model/users'

const usersStore = useUsersStore()

z.config(z.locales.ru())
</script>

<template>
  <UApp :locale="ru">
    <UHeader title="<>">
      <template #right>
        <ULink
          v-if="usersStore.currentUser"
          to="/profile"
        >
          {{ usersStore.currentUser.username }}
        </ULink>
      </template>
    </UHeader>
    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
