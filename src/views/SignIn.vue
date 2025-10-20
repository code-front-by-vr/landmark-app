<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useSignIn } from '@/composables/useSignIn';

import { LogIn } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input, PasswordInput } from '@ui/input';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';

const { isPending: isLoading, onSubmit } = useSignIn();
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-4">
    <div class="w-full max-w-sm">
      <Card class="bg-white border border-gray-200 py-6 px-4">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-semibold text-gray-900">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-900">Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="your@email.com"
                    :disabled="isLoading"
                    autocomplete="email"
                    class="px-3 py-2.5 border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem class="mb-4">
                <FormLabel class="text-sm font-medium text-gray-900">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    v-bind="componentField"
                    :disabled="isLoading"
                    autocomplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="flex justify-end text-sm mb-6">
              <RouterLink
                to="/forgot-password"
                class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Forgot password?
              </RouterLink>
            </div>

            <Button type="submit" size="lg" class="w-full font-medium mb-6" :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <Spinner />
                Signing in...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <LogIn class="w-4 h-4" />
                Sign In
              </span>
            </Button>
          </form>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <RouterLink to="/register" class="text-gray-900 hover:underline font-medium">
                Register
              </RouterLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
