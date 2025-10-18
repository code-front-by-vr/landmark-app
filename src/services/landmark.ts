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
  type QueryDocumentSnapshot,
  type DocumentData,
  startAfter,
} from '@/api/firebase';
import type { Landmark, NewLandmarkInput, Photo } from '@/types/landmark';
import { calculateRatingStats } from '@/lib';
import { LANDMARK_CONFIG, FILE_UPLOAD_CONFIG, type Rating } from '@/config/constants';
import type { Query } from 'firebase/firestore';

const landmarkCollection = collection(db, 'landmarks');

async function uploadFiles(
  files: File[],
  landmarkId: string,
  existingPhotos: Photo[] = []
): Promise<Photo[]> {
  const photos: Photo[] = [];

  const maxFilesToUpload = Math.max(0, FILE_UPLOAD_CONFIG.MAX_FILES - existingPhotos.length);
  const filesToUpload = files.slice(0, maxFilesToUpload);

  for (const file of filesToUpload) {
    try {
      const photoId = crypto.randomUUID();
      const photoRef = ref(
        storage,
        `${FILE_UPLOAD_CONFIG.STORAGE_PATH}/${landmarkId}/${photoId}_${file.name}`
      );
      await uploadBytes(photoRef, file);
      const photoUrl = await getDownloadURL(photoRef);

      photos.push({
        id: photoId,
        url: photoUrl,
        uploadedAt: Date.now(),
        fileName: file.name,
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  return photos;
}

export async function getLandmarks(
  limitCount: number = LANDMARK_CONFIG.DEFAULT_LIMIT
): Promise<Landmark[]> {
  const q = query(landmarkCollection, orderBy('rating', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map<Landmark>(doc => ({ id: doc.id, ...doc.data() }) as Landmark);
}

export async function getUserLandmarks(
  userId: string,
  limitCount: number = LANDMARK_CONFIG.DEFAULT_LIMIT
): Promise<Landmark[]> {
  const q = query(
    landmarkCollection,
    where('createdBy', '==', userId),
    orderBy('rating', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map<Landmark>(doc => ({ id: doc.id, ...doc.data() }) as Landmark);
}

export async function getPaginatedLandmarks(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  maxCount: number = LANDMARK_CONFIG.DEFAULT_LIMIT,
  onlyMy?: boolean,
  userId?: string
) {
  let q: Query<DocumentData, DocumentData> = query(
    landmarkCollection,
    orderBy('rating', 'desc'),
    limit(maxCount)
  );

  if (onlyMy && userId) {
    q = query(
      landmarkCollection,
      where('createdBy', '==', userId),
      orderBy('rating', 'desc'),
      limit(maxCount)
    );
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const landmarks: Landmark[] = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as Landmark
  );
  const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

  const hasMore = snapshot.docs.length === maxCount;

  return {
    landmarks,
    lastDoc: newLastDoc,
    hasMore,
  };
}

export async function addLandmark(landmark: NewLandmarkInput, files: File[]): Promise<Landmark> {
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

  const photos = await uploadFiles(files, docRef.id);

  await updateDoc(docRef, { photos });

  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() } as Landmark;
}

export async function rateLandmark(
  landmarkId: string,
  userId: string,
  rating: Rating
): Promise<Landmark> {
  const landmarkRef = doc(db, 'landmarks', landmarkId);

  let updatedLandmark: Landmark | undefined;

  await runTransaction(db, async (transaction: Transaction) => {
    const landmarkDoc = await transaction.get(landmarkRef);

    if (!landmarkDoc.exists()) {
      throw new Error(`Landmark with id ${landmarkId} not found`);
    }

    const landmark = landmarkDoc.data() as Landmark;
    const userRatings = { ...(landmark.userRatings || {}), [userId]: rating };

    const { rating: newRating, visits } = calculateRatingStats(userRatings);

    transaction.update(landmarkRef, {
      userRatings,
      rating: newRating,
      visits,
    });

    updatedLandmark = {
      ...landmark,
      id: landmarkDoc.id,
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

export async function updateLandmark(
  landmarkId: string,
  landmark: NewLandmarkInput,
  files: File[],
  photoIdsToDelete: string[] = []
): Promise<Landmark> {
  const landmarkRef = doc(db, 'landmarks', landmarkId);
  const landmarkDoc = await getDoc(landmarkRef);

  if (!landmarkDoc.exists()) {
    throw new Error(`Landmark with id ${landmarkId} not found`);
  }

  const existingLandmark = landmarkDoc.data() as Landmark;

  for (const photoIdToDelete of photoIdsToDelete) {
    try {
      const photoObject = (existingLandmark.photos || []).find(
        photo => photo.id === photoIdToDelete
      );

      if (photoObject) {
        const storageRef = ref(storage, photoObject.url);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.warn('Failed to delete photo from storage:', error);
    }
  }

  let photos = (existingLandmark.photos || []).filter(
    photo => !photoIdsToDelete.includes(photo.id)
  );

  if (files.length > 0) {
    const newPhotos = await uploadFiles(files, landmarkId);
    photos = [...photos, ...newPhotos];
  }

  await updateDoc(landmarkRef, {
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    photos,
  });

  return {
    ...existingLandmark,
    id: landmarkId,
    title: landmark.title,
    description: landmark.description,
    location: landmark.location,
    photos,
  };
}

export async function deleteLandmark(landmarkId: string): Promise<void> {
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
