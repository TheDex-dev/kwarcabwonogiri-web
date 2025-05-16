import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './config.server';

const COLLECTION_NAME = 'articles';

export async function getLatestArticlesServer(count = 2) {
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
    console.error('Error getting latest articles:', error);
    return [];
  }
}
