<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import PasswordInput from './password-input.vue'
import { validatePassword } from '~/shared/model/validation'

const toast = useToast()
const usersStore = useUsersStore()

const isOpen = defineModel<boolean>('open', { default: false })

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')

function handleSubmit() {
  error.value = ''

  const user = usersStore.currentUser
  if (!user) {
    error.value = 'Пользователь не найден'
    return
  }

  if (oldPassword.value !== user.password) {
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

  usersStore.updateUser({ ...user, password: newPassword.value })
  isOpen.value = false
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
  toast.add({
    title: 'Пароль успешно изменен',
    color: 'success',
  })
}
</script>

<template>
  <UModal
    v-model:open="isOpen"

    title="Смена пароля"
    description=""
    @close="() => {
      console.log()
      if (!usersStore.currentUser?.password) return
    }"
  >
    <UCard
      class="cursor-pointer"
      @click="isOpen = true"
    >
      <div class="text-2xl mb-2">
        🔑
      </div>
      <h3 class="font-semibold text-gray-900 mb-1">
        Сменить пароль
      </h3>
      <p class="text-sm text-gray-600">
        Изменить пароль администратора
      </p>
    </UCard>

    <template #body>
      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <PasswordInput
          id="old-password"
          v-model="oldPassword"
          label="Старый пароль"
          placeholder="Введите старый пароль"
        />

        <PasswordInput
          id="new-password"
          v-model="newPassword"
          label="Новый пароль"
          placeholder="Введите новый пароль"
        />

        <PasswordInput
          id="confirm-password"
          v-model="confirmPassword"
          label="Подтверждение пароля"
          placeholder="Повторите новый пароль"
        />

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
            Сохранить
          </button>
        </div>
      </form>
    </template>
  </UModal>
</template>
