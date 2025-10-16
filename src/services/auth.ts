import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from '@/api/firebase';
import type { ForgotPasswordFormData, SignInFormData } from '@/schemas/auth';

export async function registerUser({ email, password }: SignInFormData): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginUser({ email, password }: SignInFormData): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function forgotPassword({ email }: ForgotPasswordFormData): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise(resolve => {
    const removeListener = onAuthStateChanged(auth, user => {
      removeListener();
      resolve(user);
    });
  });
};
