<script setup lang="ts">
import ChangePasswordDialog from '@/components/change-password-dialog.vue'
import AddUserDialog from '@/components/add-user-dialog.vue'
import UserListDialog from '@/components/user-list-dialog.vue'
import { AboutCard } from '~/shared/ui'
import { useUsersStore } from '~/shared/model/users'

const router = useRouter()
const usersStore = useUsersStore()
const { currentUser, isAdmin } = storeToRefs(usersStore)

if (!currentUser.value) {
  router.push('/')
}

const isOpenChangePasswordDialog = ref(false)

if (!currentUser.value?.password) {
  isOpenChangePasswordDialog.value = true
}

function handleLogout() {
  usersStore.logout()

  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold text-gray-900">
            Панель {{ isAdmin ? 'администратора' : 'пользователя' }}
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
          Добро пожаловать, {{ currentUser?.username }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChangePasswordDialog v-model:open="isOpenChangePasswordDialog" />

        <template v-if="isAdmin">
          <AddUserDialog />
          <UserListDialog />
        </template>

        <AboutCard />
      </div>
    </div>
  </div>
</template>
