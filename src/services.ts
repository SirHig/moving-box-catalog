import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Box, BoxInput } from './types';

const BOXES_COLLECTION = 'boxes';

export async function uploadImage(file: Blob, boxNumber: number): Promise<string> {
  const storageRef = ref(storage, `boxes/box-${boxNumber}-${Date.now()}.jpg`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function analyzeImage(imageDataUrl: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image of items being packed for moving. List all visible items concisely and describe what type of items they are (e.g., kitchen items, books, electronics, clothing). Be specific and thorough.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function addBox(boxData: BoxInput): Promise<string> {
  const docRef = await addDoc(collection(db, BOXES_COLLECTION), {
    ...boxData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateBox(id: string, updates: Partial<BoxInput>): Promise<void> {
  const docRef = doc(db, BOXES_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteBox(id: string): Promise<void> {
  const docRef = doc(db, BOXES_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getAllBoxes(): Promise<Box[]> {
  const q = query(collection(db, BOXES_COLLECTION), orderBy('boxNumber', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Box;
  });
}

export async function searchBoxes(searchTerm: string): Promise<Box[]> {
  // Get all boxes and filter client-side (Firestore doesn't support full-text search without extensions)
  const boxes = await getAllBoxes();
  const lowerSearch = searchTerm.toLowerCase();
  
  return boxes.filter((box) =>
    box.aiDescription.toLowerCase().includes(lowerSearch) ||
    box.customLabel?.toLowerCase().includes(lowerSearch) ||
    box.room?.toLowerCase().includes(lowerSearch) ||
    box.boxNumber.toString().includes(lowerSearch)
  );
}

export async function getNextBoxNumber(): Promise<number> {
  const boxes = await getAllBoxes();
  return boxes.length > 0 ? Math.max(...boxes.map(b => b.boxNumber)) + 1 : 1;
}
