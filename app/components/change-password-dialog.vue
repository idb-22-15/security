<script setup lang="ts">
import { ref, watch } from 'vue'
import PasswordInput from './password-input.vue'
import { validatePassword } from '~/shared/model/validation'
import { updateUserPassword, getUserByUsername } from '~/shared/model/storage'

const props = defineProps<{
  isOpen: boolean
  username: string
  requireOldPassword: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    error.value = ''
  }
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  error.value = ''

  const user = getUserByUsername(props.username)
  if (!user) {
    error.value = 'Пользователь не найден'
    return
  }

  if (props.requireOldPassword && oldPassword.value !== user.password) {
    error.value = 'Неверный старый пароль'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  const validation = validatePassword(newPassword.value, user.hasPasswordRestrictions)
  if (!validation.isValid) {
    error.value = validation.message
    return
  }

  if (updateUserPassword(props.username, newPassword.value)) {
    emit('success')
    emit('close')
  }
  else {
    error.value = 'Ошибка при сохранении пароля'
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-background border border-border rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 class="text-xl font-bold text-foreground mb-4">
        Смена пароля
      </h2>

      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <password-input
          v-if="requireOldPassword"
          id="old-password"
          v-model="oldPassword"
          label="Старый пароль"
          placeholder="Введите старый пароль"
          required
        />

        <password-input
          id="new-password"
          v-model="newPassword"
          label="Новый пароль"
          placeholder="Введите новый пароль"
          required
        />

        <password-input
          id="confirm-password"
          v-model="confirmPassword"
          label="Подтверждение пароля"
          placeholder="Повторите новый пароль"
          required
        />

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
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
