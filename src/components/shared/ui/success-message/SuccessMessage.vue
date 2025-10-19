<script setup lang="ts">
import { Mail } from 'lucide-vue-next';

interface Props {
  message: string;
  icon?: typeof Mail;
}

withDefaults(defineProps<Props>(), {
  icon: Mail,
});
</script>

<template>
  <div class="space-y-4">
    <div class="text-center space-y-2">
      <div class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100">
        <component :is="icon" class="w-6 h-6 text-green-600" />
      </div>
      <p class="text-sm text-gray-600">
        {{ message }}
      </p>
    </div>
    <slot />
  </div>
</template>
