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
  updateDoc,
  getDoc,
  where,
  runTransaction,
  type Transaction,
  deleteDoc,
  listAll,
  deleteObject,
} from '@/api/firebase';
import type { Landmark, NewLandmarkInput } from '@/types/landmark';
import { calculateRatingStats } from '@/lib/utils';
import { LANDMARK_CONFIG, FILE_UPLOAD_CONFIG } from '@/config/constants';

const landmarkCollection = collection(db, 'landmarks');

async function uploadFiles(files: File[], landmarkId: string): Promise<string[]> {
  const photosUrl: string[] = [];

  for (const file of files.slice(0, FILE_UPLOAD_CONFIG.MAX_FILES)) {
    try {
      const photoRef = ref(
        storage,
        `${FILE_UPLOAD_CONFIG.STORAGE_PATH}/${landmarkId}/${file.name}`
      );
      await uploadBytes(photoRef, file);
      const photoUrl = await getDownloadURL(photoRef);
      photosUrl.push(photoUrl);
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  return photosUrl;
}

export async function getLandmarksService(
  limitCount: number = LANDMARK_CONFIG.DEFAULT_LIMIT
): Promise<Landmark[]> {
  const q = query(landmarkCollection, orderBy('rating', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}

export async function addLandmarkService(
  landmark: NewLandmarkInput,
  files: File[]
): Promise<Landmark> {
  // Each landmark stores its own userRatings object
  const userRatings = { [landmark.createdBy]: landmark.rating ?? 0 };

  const { rating: calculatedRating, visits } = calculateRatingStats(userRatings);

  const docRef = await addDoc(landmarkCollection, {
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    createdBy: landmark.createdBy,
    photos: [],
    rating: calculatedRating,
    visits,
    userRatings,
  });

  const photosUrl = await uploadFiles(files, docRef.id);

  await updateDoc(docRef, { photos: photosUrl });

  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...(docSnap.data() as Landmark) };
}

export async function getLandmarkByIdService(id: string): Promise<Landmark> {
  const docRef = doc(db, 'landmarks', id);
  const docSnap = await getDoc(docRef);

  return { id: docSnap.id, ...(docSnap.data() as Landmark) };
}

export async function rateLandmarkService(
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

    const { rating: newRating, visits } = calculateRatingStats(userRatings);

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

export async function getUserLandmarksService(userId: string): Promise<Landmark[]> {
  const q = query(landmarkCollection, where('createdBy', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Landmark) }));
}

export async function updateLandmarkService(
  landmarkId: string,
  landmark: NewLandmarkInput,
  files: File[]
): Promise<Landmark> {
  const landmarkRef = doc(db, 'landmarks', landmarkId);
  const landmarkDoc = await getDoc(landmarkRef);

  if (!landmarkDoc.exists()) {
    throw new Error('Landmark does not exist!');
  }

  const existingLandmark = landmarkDoc.data() as Landmark;

  let photosUrl = existingLandmark.photos || [];

  if (files.length > 0) {
    const newPhotos = await uploadFiles(files, landmarkId);
    photosUrl = [...photosUrl, ...newPhotos];
  }

  await updateDoc(landmarkRef, {
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    photos: photosUrl,
  });

  return {
    id: landmarkId,
    ...existingLandmark,
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    photos: photosUrl,
  };
}

export async function deleteLandmarkService(landmarkId: string): Promise<void> {
  const landmarkRef = doc(db, 'landmarks', landmarkId);

  const photosRef = ref(storage, `${FILE_UPLOAD_CONFIG.STORAGE_PATH}/${landmarkId}`);
  try {
    const photosList = await listAll(photosRef);
    await Promise.all(photosList.items.map(item => deleteObject(item)));
  } catch (error) {
    console.warn('Failed to delete some photos:', error);
  }

  await deleteDoc(landmarkRef);
}
