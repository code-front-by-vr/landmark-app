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
  runTransaction,
  type Transaction,
} from '@/api/firebase';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import { calculateRating } from '@/lib/utils';

const LIMIT_COUNT = 10;
const landmarkCollection = collection(db, 'landmarks');

export async function getLandmarks(limitCount: number = LIMIT_COUNT): Promise<Landmark[]> {
  const q = query(landmarkCollection, orderBy('rating', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}

export async function addLandmark(landmark: NewLandmarkInput, files: File[]): Promise<Landmark> {
  const userRatings = { [landmark.createdBy]: landmark.rating };

  const { rating: calculatedRating, visits } = calculateRating(userRatings);

  const docRef = await addDoc(landmarkCollection, {
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    createdBy: landmark.createdBy,
    photos: [],
    rating: calculatedRating,
    visits,
    userRatings,
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

  return {
    id: docRef.id,
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    createdBy: landmark.createdBy,
    photos: photosUrl,
    rating: calculatedRating,
    visits,
    userRatings,
    createdAt: serverTimestamp() as ReturnType<typeof serverTimestamp>,
  };
}

export async function getLandmarkById(id: string): Promise<Landmark> {
  const docRef = doc(db, 'landmarks', id);
  const docSnap = await getDoc(docRef);

  return { id: docSnap.id, ...(docSnap.data() as Landmark) };
}

export async function rateLandmark(
  landmarkId: string,
  userId: string,
  rating: number
): Promise<Landmark> {
  const landmarkRef = doc(db, 'landmarks', landmarkId);

  let updatedLandmark: Landmark | undefined;

  await runTransaction(db, async (transaction: Transaction) => {
    const landmarkDoc = await transaction.get(landmarkRef);

    if (!landmarkDoc.exists()) {
      throw new Error('Landmark does not exist!');
    }

    const landmark = landmarkDoc.data() as Landmark;
    const userRatings = landmark.userRatings || {};

    userRatings[userId] = rating;

    const { rating: newRating, visits } = calculateRating(userRatings);

    transaction.update(landmarkRef, {
      userRatings,
      rating: newRating,
      visits,
    });

    updatedLandmark = {
      id: landmarkDoc.id,
      ...landmark,
      userRatings,
      rating: newRating,
      visits,
    };
  });

  if (!updatedLandmark) {
    throw new Error('Failed to update landmark');
  }

  return updatedLandmark;
}

export async function getUserLandmarks(userId: string): Promise<Landmark[]> {
  const q = query(landmarkCollection, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}
