<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import type { User } from '~/shared/types'

const usersStore = useUsersStore()

const users = computed(() => usersStore.users.filter(u => u.username !== 'ADMIN'))

const isOpen = ref(false)

function toggleBlock(user: User) {
  usersStore.updateUser({ ...user, isBlocked: !user.isBlocked })
}

function toggleRestrictions(user: User) {
  if (!user.hasPasswordRestrictions) {
    usersStore.updateUser({ ...user, hasPasswordRestrictions: true, needPasswordChange: true })
  }
  else {
    usersStore.updateUser({ ...user, hasPasswordRestrictions: false })
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Список пользователей"
  >
    <UCard
      class="cursor-pointer"
      @click="isOpen = true"
    >
      <div class="text-2xl mb-2">
        👥
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">
        Список пользователей
      </h3>
      <p class="text-sm text-gray-600">
        Просмотр и управление пользователями
      </p>
    </UCard>

    <template #body>
      <div
        v-if="users.length === 0"
        class="text-center text-muted-foreground py-8"
      >
        Нет зарегистрированных пользователей
      </div>

      <div
        v-else
        class="space-y-3 max-h-96 overflow-y-auto"
      >
        <div
          v-for="user in users"
          :key="user.username"
          class="border border-border rounded-lg p-4 space-y-2"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-foreground">
              {{ user.username }}
            </h3>
            <span
              v-if="user.isBlocked"
              class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
            >
              Заблокирован
            </span>
          </div>

          <div class="text-sm text-muted-foreground space-y-1">
            <div>Ограничения на пароль: {{ user.hasPasswordRestrictions ? 'Да' : 'Нет' }}</div>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              class="text-sm px-3 py-1 border border-border rounded hover:bg-accent"
              @click="toggleBlock(user)"
            >
              {{ user.isBlocked ? 'Разблокировать' : 'Заблокировать' }}
            </button>
            <button
              class="text-sm px-3 py-1 border border-border rounded hover:bg-accent"
              @click="toggleRestrictions(user)"
            >
              {{ user.hasPasswordRestrictions ? 'Отключить ограничения' : 'Включить ограничения' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
