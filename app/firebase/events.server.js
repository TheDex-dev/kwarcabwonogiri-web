import { collection, getDocs } from 'firebase/firestore';
import { db } from './config.server';

const COLLECTION_NAME = 'events';

// Common filtering logic
const filterEventsByType = (events, type) => {
  return events.filter(event => 
    event.type === type || 
    (event.targetAudience && 
     Array.isArray(event.targetAudience) && 
     event.targetAudience.includes(type))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Server-side event fetching
export async function getEventsByTypeServer(type) {
  try {
    const eventsRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(eventsRef);
    
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return filterEventsByType(events, type);
  } catch (error) {
    console.error('Error fetching events by type:', error);
    return [];
  }
}