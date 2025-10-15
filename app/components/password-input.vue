<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  id: string
  label?: string
  modelValue: string
  placeholder?: string
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-foreground"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        :required="required"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
      </button>
    </div>
  </div>
</template>
