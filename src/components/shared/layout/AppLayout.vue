<script setup lang="ts">
import Header from '@/components/shared/layout/Header.vue';
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] min-h-screen mx-auto bg-gray-50">
    <Header />
    <main class="container mx-auto w-full flex flex-col gap-6 px-4">
      <slot />
    </main>
  </div>
</template>
