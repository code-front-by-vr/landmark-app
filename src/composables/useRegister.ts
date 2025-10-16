import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

export function useRegister() {
  const router = useRouter();
  const authStore = useAuthStore();

  const formSchema = toTypedSchema(registerSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormData) => authStore.register(values),
    onSuccess: () => {
      form.resetForm();
      toast.success('Registration Successful', {
        description: 'Your account has been created. You can now sign in.',
      });
      router.push('/');
    },
    onError: () => {
      toast.error('Registration Error', { description: 'Failed to register' });
    },
  });

  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return {
    form,
    ...mutation,
    onSubmit,
  };
}
