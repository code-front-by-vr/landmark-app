<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { MapPin } from 'lucide-vue-next';
import { Button } from '@ui/button';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-full">
    <section class="flex flex-col items-center text-center py-16 md:py-24 px-4">
      <div class="flex items-center gap-3 mb-6">
        <MapPin class="size-12 md:size-16 text-primary" />
      </div>

      <h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
        Explore the World's
        <span class="text-primary block mt-2">Landmarks</span>
      </h1>

      <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
        Discover, share, and save amazing places from around the globe. Start your journey today and
        explore landmarks that inspire you.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <Button
          v-if="authStore.isAuthenticated"
          as="a"
          :as-child="true"
          size="lg"
          class="text-base px-8"
        >
          <RouterLink to="/map">Get Started</RouterLink>
        </Button>
        <Button v-else as="a" :as-child="true" size="lg" class="text-base px-8">
          <RouterLink to="/sign-in">Sign In to Get Started</RouterLink>
        </Button>
      </div>
    </section>
  </div>
</template>
