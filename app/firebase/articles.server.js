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
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        date: data.date?.toDate?.()?.toISOString() || data.date
      };
    });
  } catch (error) {
    console.error('Error getting latest articles:', error);
    return [];
  }
}
