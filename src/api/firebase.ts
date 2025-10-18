import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  runTransaction,
  type Transaction,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { firebaseConfig } from '@/config/firebase';

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  collection,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where,
  runTransaction,
  type Transaction,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
};
