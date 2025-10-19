<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import { TOASTER_CONFIG } from '@/config/constants';
</script>

<template>
  <RouterView />
  <Toaster position="top-center" :duration="TOASTER_CONFIG.DURATION" richColors />
</template>
