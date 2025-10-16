import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema, type SignInFormData } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { useMutation } from '@tanstack/vue-query';

export function useSignIn() {
  const router = useRouter();
  const authStore = useAuthStore();

  const formSchema = toTypedSchema(signInSchema);

  const form = useForm({
    validationSchema: formSchema,
  });

  const mutation = useMutation({
    mutationFn: (values: SignInFormData) => authStore.login(values),
    onSuccess: () => {
      form.resetForm();
      router.push('/map');
    },
    onError: error => {
      console.error('Sign in error:', error);
    },
  });

  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return {
    form,
    ...mutation,
    onSubmit,
  };
}
