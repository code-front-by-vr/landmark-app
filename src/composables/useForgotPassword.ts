import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth';
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

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
      toast.success('Email Sent', {
        description: 'Check your email to reset your password.',
      });
    },
    onError: () => {
      toast.error('Password Reset Error', { description: 'Failed to send reset email' });
    },
  });
  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return {
    form,
    ...mutation,
    onSubmit,
  };
}
