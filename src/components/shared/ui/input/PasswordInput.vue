<script setup lang="ts">
import { ref, computed } from 'vue';
import { Input } from '@ui/input';
import { Eye, EyeOff } from 'lucide-vue-next';

interface PasswordInputProps {
  placeholder?: string;
  disabled?: boolean;
  autocomplete?: string;
}

const props = withDefaults(defineProps<PasswordInputProps>(), {
  placeholder: '••••••••',
  autocomplete: 'current-password',
});

defineOptions({
  inheritAttrs: false,
});

const showPassword = ref(false);

const inputType = computed(() => (showPassword.value ? 'text' : 'password'));

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="relative">
    <Input
      v-bind="$attrs"
      :type="inputType"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :autocomplete="props.autocomplete"
      class="px-3 py-2.5 pr-10 border-gray-300"
    />
    <button
      type="button"
      @click="togglePasswordVisibility"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
      :disabled="props.disabled"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    >
      <Eye v-if="!showPassword" class="w-4 h-4" />
      <EyeOff v-else class="w-4 h-4" />
    </button>
  </div>
</template>
