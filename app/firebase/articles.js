'use client';

import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'articles';

export async function getArticles() {
  try {
    const articlesCollection = collection(db, COLLECTION_NAME);
    const articlesSnapshot = await getDocs(articlesCollection);
    return articlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting articles:', error);
    throw error;
  }
}

export async function addArticle(articleData) {
  try {
    // Add metadata
    const finalArticleData = {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), finalArticleData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
}

export async function updateArticle(articleId, articleData) {
  try {
    const articleRef = doc(db, COLLECTION_NAME, articleId);
    await updateDoc(articleRef, {
      ...articleData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

export async function deleteArticle(articleId) {
  try {
    const articleRef = doc(db, COLLECTION_NAME, articleId);
    await deleteDoc(articleRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}
