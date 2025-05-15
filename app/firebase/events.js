import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

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

// Client-side functions
'use client';

export async function getAllEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventsByType(type) {
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

export async function addEvent(eventData) {
  try {
    // Enforce consistent event structure
    const standardizedEvent = {
      // Required fields with defaults if not provided
      title: eventData.title || '',
      description: eventData.description || '',
      date: eventData.date || new Date().toISOString(),
      location: eventData.location || '',
      type: eventData.type || 'other',
      image: eventData.image || '/images/hero0.jpeg',
      
      // Optional fields
      category: eventData.category || '',
      capacity: eventData.capacity || null,
      registrationLink: eventData.registrationLink || null,
      targetAudience: Array.isArray(eventData.targetAudience) ? eventData.targetAudience : [],
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), standardizedEvent);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    return eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};