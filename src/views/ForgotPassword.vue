<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { forgotPasswordSchema } from '@/schemas/auth';

import { Mail } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';

const formSchema = toTypedSchema(forgotPasswordSchema);

const form = useForm({
  validationSchema: formSchema,
});

const isLoading = ref(false);
const isSuccess = ref(false);

const onSubmit = form.handleSubmit(async () => {
  isLoading.value = true;
  try {
    // TODO: add password reset to firebase
    isSuccess.value = true;
  } catch (error) {
    console.error('Password reset error:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-4">
    <div class="w-full max-w-sm">
      <Card class="bg-white border border-gray-200 py-6 px-4 gap-4">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl font-semibold text-gray-900">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="isSuccess" class="space-y-4">
            <div class="text-center space-y-2">
              <div
                class="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100"
              >
                <Mail class="w-6 h-6 text-green-600" />
              </div>
              <p class="text-sm text-gray-600">
                Password reset instructions have been sent to your email address.
              </p>
            </div>
            <Button type="button" size="lg" class="w-full font-medium" @click="isSuccess = false">
              Send Again
            </Button>
            <div class="text-center">
              <RouterLink to="/sign-in" class="text-sm text-gray-900 hover:underline font-medium">
                Back to Sign In
              </RouterLink>
            </div>
          </div>

          <div v-else>
            <p class="text-sm text-gray-600 text-center mb-5">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <form @submit.prevent="onSubmit" class="space-y-4">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem class="mb-6">
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

              <Button type="submit" size="lg" class="w-full font-medium mb-6" :disabled="isLoading">
                <span v-if="isLoading" class="flex items-center justify-center gap-2">
                  <Spinner />
                  Sending...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Mail class="w-4 h-4" />
                  Send Reset Link
                </span>
              </Button>
            </form>

            <div class="text-center space-y-2">
              <p class="text-sm text-gray-600">
                Remember your password?
                <RouterLink to="/sign-in" class="text-gray-900 hover:underline font-medium">
                  Sign In
                </RouterLink>
              </p>
              <p class="text-sm text-gray-600">
                Don't have an account?
                <RouterLink to="/register" class="text-gray-900 hover:underline font-medium">
                  Register
                </RouterLink>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
