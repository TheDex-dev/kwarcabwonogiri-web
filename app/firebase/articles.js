'use client';

import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, addDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'articles';

export async function getAllArticles() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getLatestArticles(count = 4) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('date', 'desc'),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
}

export async function getArticlesByCategory(category) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

export async function addArticle(articleData) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...articleData };
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}