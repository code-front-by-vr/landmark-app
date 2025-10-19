<script setup lang="ts">
import { computed, ref } from 'vue';
import { Star } from 'lucide-vue-next';
import { RATING_CONFIG, RATING_SIZE_MAP, type RatingSize } from '@/config/constants';

interface RatingProps {
  modelValue?: number;
  max?: number;
  disabled?: boolean;
  size?: RatingSize;
}

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  max: RATING_CONFIG.MAX,
  disabled: false,
  size: 'md',
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  click: [value: number];
}>();

const hoveredStar = ref<number | null>(null);
const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1));
const sizeClasses = computed(() => RATING_SIZE_MAP[props.size]);

const handleStarClick = (value: number) => {
  if (props.disabled) return;

  emit('update:modelValue', value);
  emit('click', value);
};

function handleStarHover(star: number) {
  if (props.disabled) return;

  hoveredStar.value = star;
}

function handleMouseLeave() {
  hoveredStar.value = null;
}

function isStarFilled(star: number) {
  const targetValue = hoveredStar.value ?? props.modelValue;
  return star <= targetValue;
}

function getStarClasses(star: number) {
  const baseClasses = `${sizeClasses.value} transition-all duration-150`;
  const colorClass = props.disabled ? 'cursor-default' : 'cursor-pointer hover:scale-125';
  const filledClass = isStarFilled(star) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300';

  return `${baseClasses} ${colorClass} ${filledClass}`;
}
</script>

<template>
  <div class="flex items-center gap-1" @mouseleave="handleMouseLeave">
    <Star
      v-for="star in stars"
      :key="star"
      :class="getStarClasses(star)"
      @click.stop.prevent="handleStarClick(star)"
      @mouseenter="handleStarHover(star)"
    />
  </div>
</template>
