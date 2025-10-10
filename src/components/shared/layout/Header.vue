<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { MapPin } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const navLinks = computed(() => {
  return authStore.isAuthenticated
    ? [{ to: '/map', label: 'Map' }]
    : [
        { to: '/sign-in', label: 'Sign In' },
        { to: '/register', label: 'Register' },
      ];
});

function handleLogout() {
  authStore.logout();
  router.push('/sign-in');
}
</script>

<template>
  <header class="w-full border-b">
    <div class="container mx-auto px-4 py-2 md:px-6">
      <nav class="flex justify-between items-center">
        <RouterLink
          to="/"
          class="flex items-center gap-2 font-bold text-lg md:text-xl text-primary hover:text-primary/80 transition-colors group"
        >
          <MapPin
            class="size-6 md:size-7 text-current group-hover:scale-110 transition-transform"
          />
          <span class="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            LandMark
          </span>
        </RouterLink>

        <div v-if="authStore.isAuthenticated" class="flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors"
            active-class="!text-primary"
          >
            {{ link.label }}
          </RouterLink>
          <button
            @click="handleLogout"
            class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div v-else class="flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors"
            active-class="!text-primary"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>
