<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="О программе"
  >
    <UCard
      class="cursor-pointer"
      @click="isOpen = true"
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
    </UCard>

    <template #body>
      <div class="space-y-2 text-gray-700">
        <p><strong>Лабораторная работа №1</strong></p>
        <p>Разработка программы разграничения полномочий пользователей</p>
        <p><strong>Вариант 14:</strong> Наличие строчных и прописных букв, а также знаков арифметических операций</p>
      </div>
    </template>
    <template #footer>
      <strong>Автор:</strong> Набойщиков Артемий ИДБ-22-15
    </template>
  </UModal>
</template>
