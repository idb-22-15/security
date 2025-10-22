<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { validatePassword } from '~/shared/model/validation'

definePageMeta({
  middleware: ['logged-in'],
})

const usersStore = useUsersStore()
const toast = useToast()
const router = useRouter()

const form = useTemplateRef('form')

const state = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const error = ref('')

watch(state, () => {
  error.value = ''
}, { deep: true })

const schema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type Schema = z.output<typeof schema>

const onSubmit = (e: FormSubmitEvent<Schema>) => {
  if (!usersStore.currentUser) return

  console.log('usersStore.currentUser', usersStore.currentUser)

  const { newPassword } = e.data

  if (usersStore.currentUser.password !== state.value.currentPassword) {
    error.value = 'Неверный текущий пароль'
    return
  }

  const result = validatePassword(newPassword, usersStore.currentUser.hasPasswordRestrictions)

  if (!result.isValid) {
    error.value = result.message
    return
  }

  usersStore.updateUser({
    ...usersStore.currentUser,
    password: newPassword,
    needPasswordChange: false,
  })

  console.log('newPassword', newPassword)
  console.log(usersStore.users)

  toast.add({
    title: 'Пароль успешно изменен',
    color: 'success',
  })

  usersStore.logout()
  router.push('/')
}
</script>

<template>
  <main class="w-full flex flex-col items-center ">
    <UCard class="w-sm mt-10">
      <template #header>
        <h1 class="text-2xl font-bold ">
          Изменение пароля
        </h1>
      </template>

      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4 mx-auto w-full"
        @submit.prevent="onSubmit"
      >
        <UFormField
          label="Текущий пароль"
          name="currentPassword"
        >
          <UInput
            v-model="state.currentPassword"
            class="w-full"
            type="password"
          />
        </UFormField>

        <UFormField
          label="Новый пароль"
          name="newPassword"
        >
          <UInput
            v-model="state.newPassword"
            class="w-full"
            type="password"
          />
        </UFormField>

        <UFormField
          label="Подтвердите новый пароль"
          name="confirmPassword"
        >
          <UInput
            v-model="state.confirmPassword"
            class="w-full"
            type="password"
          />
        </UFormField>

        <p
          v-if="error"
          class="text-error"
        >
          {{ error }}
        </p>

        <UButton
          type="submit"
          :disabled="!!form?.errors.length"
        >
          Изменить пароль
        </UButton>
      </UForm>
    </UCard>
  </main>
</template>
