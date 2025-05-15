'use client';

import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'articles';

// Server-side article fetching
export async function getArticleServer(id) {
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

export async function getArticles(options = {}) {
  try {
    let q = collection(db, COLLECTION_NAME);
    
    if (options.category) {
      q = query(q, where('category', '==', options.category));
    }
    
    if (options.limit) {
      q = query(q, orderBy('date', 'desc'), limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
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
  return getArticles({ limit: count });
}

export async function getArticlesByCategory(category) {
  return getArticles({ category });
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

export const updateArticle = async (articleId, articleData) => {
  try {
    const articleRef = doc(db, COLLECTION_NAME, articleId);
    await updateDoc(articleRef, articleData);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const articleRef = doc(db, COLLECTION_NAME, articleId);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

