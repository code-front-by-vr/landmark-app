import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { registerSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';

export function useRegister() {
  const router = useRouter();
  const authStore = useAuthStore();

  const formSchema = toTypedSchema(registerSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const isLoading = ref(false);

  const onSubmit = form.handleSubmit(async ({ email, password }, { resetForm }) => {
    isLoading.value = true;

    try {
      await authStore.register({ email, password });
      resetForm();
      router.push('/');
    } catch (error) {
      console.error('Register error:', error);
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
