import type { LoginFormValues } from '@/types';
import { type User } from '@/api/firebase';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { loginUser, logoutUser, registerUser } from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  function clearUser() {
    user.value = null;
  }

  async function register({ email, password }: LoginFormValues) {
    try {
      const registeredUser = await registerUser({ email, password });
      user.value = registeredUser;
      return registeredUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async function login({ email, password }: LoginFormValues) {
    try {
      const loggedInUser = await loginUser({ email, password });
      user.value = loggedInUser;
      return loggedInUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutUser();
      user.value = null;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  return { user, isAuthenticated, register, login, logout, setUser, clearUser };
});
