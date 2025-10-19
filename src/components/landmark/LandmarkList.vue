<script lang="ts" setup>
import type { Landmark } from '@/types/landmark';
import LandmarkCard from './LandmarkCard.vue';
import { useLandmarkStore } from '@/stores/landmark';

const props = defineProps<{
  landmarks: Landmark[];
}>();

const landmarkStore = useLandmarkStore();

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  if (scrollHeight - scrollTop - clientHeight < 100) {
    landmarkStore.loadMoreLandmarks();
  }
}
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
