<script setup lang="ts">
import { ref, watch } from 'vue'
import { saveUser, getUserByUsername } from '~/shared/model/storage'
import type { User } from '~/shared/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const username = ref('')
const hasPasswordRestrictions = ref(false)
const error = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    username.value = ''
    hasPasswordRestrictions.value = false
    error.value = ''
  }
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  error.value = ''

  if (!username.value.trim()) {
    error.value = 'Введите имя пользователя'
    return
  }

  if (getUserByUsername(username.value)) {
    error.value = 'Пользователь с таким именем уже существует'
    return
  }

  const newUser: User = {
    username: username.value,
    password: '',
    isBlocked: false,
    hasPasswordRestrictions: hasPasswordRestrictions.value,
  }

  saveUser(newUser)
  emit('success')
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-background border border-border rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 class="text-xl font-bold text-foreground mb-4">
        Добавление пользователя
      </h2>

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
            type="button"
            class="px-4 py-2 border border-border rounded-md hover:bg-accent"
            @click="handleClose"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
