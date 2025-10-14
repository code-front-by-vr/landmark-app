<script setup lang="ts">
import LayoutHeader from '@/components/shared/layout/LayoutHeader.vue';
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] min-h-screen mx-auto bg-gray-50">
    <LayoutHeader />
    <main class="container mx-auto w-full flex flex-col gap-6 px-4">
      <div class="flex-1">
        <slot />
      </div>
    </main>
  </div>
</template>
