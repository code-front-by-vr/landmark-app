import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema } from '@/schemas/auth';
import { loginUserService } from '@/services/auth';

export function useSignIn() {
  const router = useRouter();

  const formSchema = toTypedSchema(signInSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const isLoading = ref(false);
  const showPassword = ref(false);

  const onSubmit = form.handleSubmit(async ({ email, password }, { resetForm }) => {
    isLoading.value = true;

    try {
      await loginUserService({ email, password });

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
    showPassword,
    onSubmit,
  };
}
