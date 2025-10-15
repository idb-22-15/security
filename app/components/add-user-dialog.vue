<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import type { User } from '~/shared/types'

const usersStore = useUsersStore()

const toast = useToast()
const isOpen = ref(false)

const username = ref('')
const hasPasswordRestrictions = ref(false)
const error = ref('')

function handleSubmit() {
  error.value = ''

  if (!username.value.trim()) {
    error.value = 'Введите имя пользователя'
    return
  }

  if (usersStore.getUserByUsername(username.value)) {
    error.value = 'Пользователь с таким именем уже существует'
    return
  }

  const newUser: User = {
    username: username.value,
    password: '',
    isBlocked: false,
    hasPasswordRestrictions: hasPasswordRestrictions.value,
  }

  usersStore.addUser(newUser)

  toast.add({
    title: 'Пользователь успешно добавлен',
    color: 'success',
  })
  isOpen.value = false
  username.value = ''
  hasPasswordRestrictions.value = false
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    class="cursor-pointer"
    title="Добавление пользователя"
  >
    <UCard @click="isOpen = true">
      <div class="text-2xl mb-2">
        ➕
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">
        Добавить пользователя
      </h3>
      <p class="text-sm text-gray-600">
        Создать новую учетную запись
      </p>
    </UCard>

    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-2">
          <label
            for="username"
            class="block text-sm font-medium text-foreground"
          >
            Имя пользователя
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите имя пользователя"
            class="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
        </div>

        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="hasPasswordRestrictions"
              type="checkbox"
              class="w-4 h-4 rounded border-input"
            >
            <span class="text-sm text-foreground">Включить ограничения на пароль</span>
          </label>
        </div>

        <div
          v-if="error"
          class="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2"
        >
          {{ error }}
        </div>

        <div class="flex gap-2 justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Добавить
          </button>
        </div>
      </form>
    </template>
  </UModal>
</template>
