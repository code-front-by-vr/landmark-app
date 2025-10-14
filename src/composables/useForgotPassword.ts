import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { forgotPasswordSchema } from '@/schemas/auth';

export function useForgotPassword() {
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

  return {
    form,
    isLoading,
    isSuccess,
    onSubmit,
  };
}
