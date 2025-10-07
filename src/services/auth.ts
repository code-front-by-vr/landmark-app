import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from '@/api/firebase';
import type { LoginFormValues } from '@/types';

export async function registerUser({ email, password }: LoginFormValues): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginUser({ email, password }: LoginFormValues): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise(resolve => {
    const removeListener = onAuthStateChanged(auth, user => {
      removeListener();
      resolve(user);
    });
  });
};
