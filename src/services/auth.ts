import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from '@/api/firebase';
import type { SignInFormData } from '@/schemas/auth';

export async function registerUserService({ email, password }: SignInFormData): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginUserService({ email, password }: SignInFormData): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUserService(): Promise<void> {
  await signOut(auth);
}

export const getCurrentUserService = (): Promise<User | null> => {
  return new Promise(resolve => {
    const removeListener = onAuthStateChanged(auth, user => {
      removeListener();
      resolve(user);
    });
  });
};
