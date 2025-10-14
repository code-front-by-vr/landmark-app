import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';

export function useSignIn() {
  const router = useRouter();
  const authStore = useAuthStore();

  const formSchema = toTypedSchema(signInSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const isLoading = ref(false);

  const onSubmit = form.handleSubmit(async ({ email, password }, { resetForm }) => {
    isLoading.value = true;

    try {
      await authStore.login({ email, password });

      resetForm();
      router.push('/map');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      isLoading.value = false;
    }
  });

  return {
    form,
    isLoading,
    onSubmit,
  };
}
