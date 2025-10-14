<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useRegister } from '@/composables/useRegister';

import { UserPlus, Eye, EyeOff } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';

const { isLoading, showPassword, showConfirmPassword, onSubmit } = useRegister();
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-4">
    <div class="w-full max-w-sm">
      <Card class="bg-white border border-gray-200 py-6 px-4">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-semibold text-gray-900">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-4">
            <FormField name="email" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-900"> Email </FormLabel>
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

            <FormField name="password" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-900"> Password </FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :disabled="isLoading"
                      autocomplete="new-password"
                      class="px-3 py-2.5 pr-10 border-gray-300"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      :disabled="isLoading"
                    >
                      <Eye v-if="!showPassword" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="confirmPassword" v-slot="{ componentField }">
              <FormItem class="mb-6">
                <FormLabel class="text-sm font-medium text-gray-900"> Confirm Password </FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      :disabled="isLoading"
                      autocomplete="new-password"
                      class="px-3 py-2.5 pr-10 border-gray-300"
                    />
                    <button
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      :disabled="isLoading"
                    >
                      <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" size="lg" class="w-full font-medium mb-6" :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <Spinner />
                Registering...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <UserPlus class="w-4 h-4" />
                Register
              </span>
            </Button>
          </form>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <RouterLink to="/sign-in" class="text-gray-900 hover:underline font-medium">
                Sign In
              </RouterLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
