<script setup lang="ts">
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
      <UInput
        :id="id"
        type="password"
        class="w-full"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
