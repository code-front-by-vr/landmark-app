import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { signInSchema, type SignInFormData } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

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
      toast.success('Success', {
        description: 'You have successfully signed in',
      });
      router.push('/map');
    },
    onError: error => {
      toast.error('Sign In Error', { description: `Failed to sign in: ${error.message}` });
    },
  });

  const onSubmit = form.handleSubmit(values => mutation.mutate(values));

  return {
    form,
    ...mutation,
    onSubmit,
  };
}
