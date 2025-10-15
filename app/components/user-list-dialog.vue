<script setup lang="ts">
import { ref, watch } from 'vue'
import { getAllUsers, saveUser } from '~/shared/model/storage'
import type { User } from '~/shared/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const users = ref<User[]>([])

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadUsers()
  }
})

function loadUsers() {
  users.value = getAllUsers()
}

function toggleBlock(user: User) {
  user.isBlocked = !user.isBlocked
  saveUser(user)
  loadUsers()
}

function toggleRestrictions(user: User) {
  user.hasPasswordRestrictions = !user.hasPasswordRestrictions
  saveUser(user)
  loadUsers()
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl p-6">
      <h2 class="text-xl font-bold text-foreground mb-4">
        Список пользователей
      </h2>

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
            <div>Пароль: {{ user.password ? '********' : '(не установлен)' }}</div>
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

      <div class="flex justify-end mt-4">
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          @click="handleClose"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>
