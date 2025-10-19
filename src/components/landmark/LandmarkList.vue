<script lang="ts" setup>
import type { Landmark } from '@/types/landmark';
import LandmarkCard from './LandmarkCard.vue';
import { useLandmarkStore } from '@/stores/landmark';
import { throttle } from '@/lib/performance';
import { PERFORMANCE_CONFIG } from '@/config/constants';

const props = defineProps<{
  landmarks: Landmark[];
}>();

const landmarkStore = useLandmarkStore();

const handleScroll = throttle((e: Event) => {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  if (scrollHeight - scrollTop - clientHeight < PERFORMANCE_CONFIG.SCROLL_THRESHOLD) {
    landmarkStore.loadMoreLandmarks();
  }
}, PERFORMANCE_CONFIG.DEFAULT_DELAY);
</script>

<template>
  <RecycleScroller
    :items="props.landmarks"
    :item-size="160"
    key-field="id"
    class="flex-1 p-4 overflow-y-auto"
    @scroll="handleScroll"
  >
    <template #default="{ item }">
      <LandmarkCard v-bind="item" />
    </template>
  </RecycleScroller>
</template>
