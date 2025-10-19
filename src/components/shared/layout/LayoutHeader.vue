<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { MapPin } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const publicRoutes = [
  { to: '/sign-in', label: 'Sign In' },
  { to: '/register', label: 'Register' },
];

const privateRoutes = [{ to: '/map', label: 'Map' }];

const currentRoutes = computed(() => (authStore.isAuthenticated ? privateRoutes : publicRoutes));

function handleLogout() {
  authStore.logout();
  window.location.href = '/sign-in';
}
</script>

<template>
  <header class="w-full border-b">
    <div class="container mx-auto px-4 py-2 md:px-6">
      <nav>
        <ul class="flex justify-between items-center gap-6 list-none">
          <li class="mr-auto">
            <RouterLink
              to="/"
              class="flex items-center gap-2 font-bold text-lg md:text-xl text-primary hover:text-primary/80 transition-colors group"
            >
              <MapPin
                class="size-6 md:size-7 text-current group-hover:scale-110 transition-transform"
              />
              <span
                class="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                LandMark
              </span>
            </RouterLink>
          </li>

          <li v-for="link in currentRoutes" :key="link.to">
            <RouterLink
              :to="link.to"
              class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              active-class="!text-primary"
            >
              {{ link.label }}
            </RouterLink>
          </li>

          <li v-if="authStore.isAuthenticated">
            <button
              @click="handleLogout"
              class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
