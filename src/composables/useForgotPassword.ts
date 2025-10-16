import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth';
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';

export function useForgotPassword() {
  const authStore = useAuthStore();
  const formSchema = toTypedSchema(forgotPasswordSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const mutation = useMutation({
    mutationFn: (values: ForgotPasswordFormData) => authStore.forgotPassword(values),
    onSuccess: () => {
      form.resetForm();
    },
    onError: error => {
      console.error('Password reset error:', error);
    },
  });
  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return {
    form,
    ...mutation,
    onSubmit,
  };
}
