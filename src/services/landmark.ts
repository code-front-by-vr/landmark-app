import {
  db,
  storage,
  collection,
  ref,
  uploadBytes,
  getDownloadURL,
  query,
  orderBy,
  limit,
  doc,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
  where,
} from '@/api/firebase';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';

const LIMIT_COUNT = 10;

const landmarkCollection = collection(db, 'landmarks');

export async function getLandmarks(limitCount: number = LIMIT_COUNT): Promise<Landmark[]> {
  const q = query(landmarkCollection, orderBy('rating', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}

export async function addLandmark(landmark: NewLandmarkInput, files: File[]): Promise<string> {
  const docRef = await addDoc(landmarkCollection, {
    ...landmark,
    photos: [],
    rating: 0,
    visits: 0,
    userRatings: {},
    createdAt: serverTimestamp(),
  });

  const photosUrl = [];
  for (const file of files.slice(0, 5)) {
    const photoRef = ref(storage, `landmarks/${docRef.id}/${file.name}`);
    await uploadBytes(photoRef, file);
    const photoUrl = await getDownloadURL(photoRef);
    photosUrl.push(photoUrl);
  }
  await updateDoc(docRef, { photos: photosUrl });

  return docRef.id;
}

export async function getLandmarkById(id: string): Promise<Landmark> {
  const docRef = doc(db, 'landmarks', id);
  const docSnap = await getDoc(docRef);

  return { id: docSnap.id, ...(docSnap.data() as Landmark) };
}

export async function rateLandmark(landmarkId: string, userId: string, rating: number) {
  const docRef = doc(db, 'landmarks', landmarkId);
  await updateDoc(docRef, {
    [`userRatings.${userId}`]: rating,
  });

  const docSnap = await getDoc(docRef);
  const landmark = docSnap.data() as Landmark;
  const newRating =
    Object.values(landmark.userRatings).reduce((acc, curr) => acc + curr, 0) /
    Object.keys(landmark.userRatings).length;
  await updateDoc(docRef, { rating: newRating });
}

export async function getUserLandmarks(userId: string): Promise<Landmark[]> {
  const q = query(landmarkCollection, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}
