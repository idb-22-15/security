<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { exit } from '~/shared/model/exit'

const usersStore = useUsersStore()
const router = useRouter()

const form = useTemplateRef('form')
const error = ref('')

const schema = z.object({
  username: z.string().min(1),
  password: z.string(),
})

type Schema = z.output<typeof schema>

const state = ref({
  username: '',
  password: '',
})

definePageMeta({
  middleware: ['decrypted', 'logged-in'],
})

// if (!usersStore.isDecrypted) {
//   router.push('/decrypt')
//   console.log('redirect to decrypt')
// }
// else if (usersStore.currentUser) {
//   router.push('/profile')
//   console.log('redirect to profile')
// }

watch(state, () => {
  error.value = ''
}, { deep: true })

function onSubmit(e: FormSubmitEvent<Schema>) {
  const { username, password } = e.data
  const result = usersStore.login(username, password)

  if (!result.success) {
    error.value = result.message

    if (result.rateLimited) {
      setTimeout(() => {
        alert('Программа будет закрыта из-за превышения попыток входа')
        exit()
      })
      return
    }
    return
  }

  if (result.needPasswordChange) {
    router.push('/change-password')
    return
  }

  router.push('/profile')
}
</script>

<template>
  <main class="w-full flex flex-col items-center ">
    <UCard class="w-sm mt-10">
      <template #header>
        <h1 class="text-2xl font-bold ">
          Вход
        </h1>
      </template>

      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4 mx-auto w-full"
        @submit="onSubmit"
      >
        <UFormField
          label="Имя"
          name="username"
        >
          <UInput
            v-model="state.username"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Пароль"
          name="password"
        >
          <UInput
            v-model="state.password"
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
          :disabled="!!form?.errors.length || !!error"
        >
          Войти
        </UButton>
      </UForm>
    </UCard>
  </main>
</template>
