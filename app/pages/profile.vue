<script setup lang="ts">
import { UserListDialog, AboutCard, AddUserDialog } from '~/shared/ui'
import { useUsersStore } from '~/shared/model/users'

const router = useRouter()
const usersStore = useUsersStore()
const { currentUser, isAdmin } = storeToRefs(usersStore)

if (!currentUser.value) {
  router.push('/')
}
else if (currentUser.value?.needPasswordChange) {
  router.push('/change-password')
}
</script>

<template>
  <UPage class="bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 space-y-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UCard
          class="cursor-pointer"
        >
          <NuxtLink to="/change-password">
            <div class="text-2xl mb-2">
              🔑
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">
              Сменить пароль
            </h3>
            <p class="text-sm text-gray-600">
              Изменить пароль администратора
            </p>
          </NuxtLink>
        </UCard>

        <template v-if="isAdmin">
          <AddUserDialog />
          <UserListDialog />
        </template>

        <AboutCard />
      </div>
    </div>
  </UPage>
</template>
