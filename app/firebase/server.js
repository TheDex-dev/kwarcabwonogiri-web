import { collection, getDocs, getDoc, doc, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './config.server';

const COLLECTION_NAME = 'articles';

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

export async function getArticlesServer(options = {}) {
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
