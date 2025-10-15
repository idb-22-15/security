<script setup lang="ts">
import { ref } from 'vue'
import ChangePasswordDialog from '@/components/change-password-dialog.vue'

const showPasswordDialog = ref(false)
const showAbout = ref(false)

function handleLogout() {
  window.location.href = '/login'
}

function handlePasswordChanged() {
  alert('Пароль успешно изменен')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold text-gray-900">
            Панель пользователя
          </h1>
          <button
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            @click="handleLogout"
          >
            Выход
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Добро пожаловать!
        </h2>
        <p class="text-gray-600">
          Вы вошли в систему как обычный пользователь
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          class="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          @click="showPasswordDialog = true"
        >
          <div class="text-2xl mb-2">
            🔑
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">
            Сменить пароль
          </h3>
          <p class="text-sm text-gray-600">
            Изменить ваш пароль
          </p>
        </button>

        <button
          class="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          @click="showAbout = true"
        >
          <div class="text-2xl mb-2">
            ℹ️
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">
            О программе
          </h3>
          <p class="text-sm text-gray-600">
            Информация о программе
          </p>
        </button>
      </div>

      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-yellow-800">
          Функции администрирования недоступны для обычных пользователей
        </p>
      </div>
    </div>

    <ChangePasswordDialog
      :is-open="showPasswordDialog"
      username="user"
      :require-old-password="true"
      @close="showPasswordDialog = false"
      @success="handlePasswordChanged"
    />

    <div
      v-if="showAbout"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          О программе
        </h2>
        <div class="space-y-2 text-gray-700">
          <p><strong>Лабораторная работа №1</strong></p>
          <p>Разработка программы разграничения полномочий пользователей</p>
          <p><strong>Вариант 14:</strong> Наличие строчных и прописных букв, а также знаков арифметических операций</p>
          <p class="pt-4 border-t border-gray-200">
            <strong>Автор:</strong> Набойщиков Артемий ИДБ-22-15
          </p>
        </div>
        <button
          class="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="showAbout = false"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
