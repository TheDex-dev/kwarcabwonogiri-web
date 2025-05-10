import { db } from './config';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';

const COLLECTION_NAME = 'gallery';

export async function addImage(imageData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...imageData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding image:', error);
    throw error;
  }
}

export async function getImages() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting images:', error);
    throw error;
  }
}

export async function deleteImage(id) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function getImagesByCategory(category) {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting images by category:', error);
    throw error;
  }
}
