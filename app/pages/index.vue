<script setup lang="ts">
import PasswordInput from '~/components/password-input.vue'
import { useUsersStore } from '~/shared/model/users'

const usersStore = useUsersStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''

  const result = usersStore.login(username.value, password.value)

  if (!result.success) {
    error.value = result.message

    if (result.rateLimited) {
      setTimeout(() => {
        alert('Программа будет закрыта из-за превышения попыток входа')
        window.close()
      }, 2000)
      return
    }
    return
  }

  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Система аутентификации
        </h1>
        <p class="text-gray-600">
          Лабораторная работа №1 - Вариант 14
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <div class="space-y-2">
          <label
            for="username"
            class="block text-sm font-medium text-gray-700"
          >
            Имя пользователя
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите имя пользователя"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <PasswordInput
          id="password"
          v-model="password"
          label="Пароль"
          placeholder="Введите пароль"
        />

        <div
          v-if="error"
          class="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          Войти
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>При первом входе пароль не установлен (пустая строка)</p>
      </div>
    </div>
  </div>
</template>
