<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { MapPin } from 'lucide-vue-next';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const navLinks = computed(() => {
  if (authStore.isAuthenticated) {
    return [{ to: '/map', label: 'Map' }];
  }

  return [
    { to: '/sign-in', label: 'Sign In' },
    { to: '/register', label: 'Register' },
  ];
});

function handleLogout() {
  authStore.logout();
  window.location.href = '/sign-in';
}
</script>

<template>
  <header class="w-full border-b">
    <div class="container mx-auto px-4 py-2 md:px-6">
      <nav>
        <ul class="flex justify-between items-center list-none">
          <li>
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

          <template v-if="authStore.isAuthenticated">
            <li>
              <ul class="flex items-center gap-6 list-none">
                <li v-for="link in navLinks" :key="link.to">
                  <RouterLink
                    :to="link.to"
                    class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    active-class="!text-primary"
                  >
                    {{ link.label }}
                  </RouterLink>
                </li>
                <li>
                  <button
                    @click="handleLogout"
                    class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>

          <template v-else>
            <li>
              <ul class="flex items-center gap-6 list-none">
                <li v-for="link in navLinks" :key="link.to">
                  <RouterLink
                    :to="link.to"
                    class="text-md font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    active-class="!text-primary"
                  >
                    {{ link.label }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>
