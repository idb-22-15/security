<script setup lang="ts">
import { useUsersStore } from '~/shared/model/users'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { exit } from '~/shared/model/exit'

const usersStore = useUsersStore()
const router = useRouter()

const error = ref('')

const schema = z.object({
  passphrase: z.string().min(1),
})

type Schema = z.output<typeof schema>

const state = ref({
  passphrase: '',
})

watch(state, () => {
  error.value = ''
}, { deep: true })

function onSubmit(e: FormSubmitEvent<Schema>) {
  const { passphrase } = e.data
  const result = usersStore.decryptUsers(passphrase)

  if (!result.success) {
    error.value = result.message
    setTimeout(() => {
      alert('Программа будет закрыта из-за неверной парольной фразы')
      exit()
    }, 0)
    return
  }

  router.push('/')
}
</script>

<template>
  <main class="w-full flex flex-col items-center ">
    <UCard class="w-md mt-10">
      <template #header>
        <h1 class="text-2xl font-bold ">
          Расшифрование базы данных
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
          label="Парольная фраза"
          name="passphrase"
        >
          <UInput
            v-model="state.passphrase"
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

        <UButton type="submit">
          Расшифровать
        </UButton>
      </UForm>
    </UCard>
  </main>
</template>
