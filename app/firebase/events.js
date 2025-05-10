'use client';

import { collection, getDocs, getDoc, doc, query, orderBy, limit, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'events';

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
    // First try to get all events since we'll need to filter by targetAudience anyway
    const eventsRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(eventsRef);
    
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter events that either match the type or include it in targetAudience
    const filteredEvents = events.filter(event => 
      event.type === type || 
      (event.targetAudience && 
       Array.isArray(event.targetAudience) && 
       event.targetAudience.includes(type))
    );

    // Sort by date descending
    return filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
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