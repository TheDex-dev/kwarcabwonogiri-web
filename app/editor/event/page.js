'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { addEvent, updateEvent, deleteEvent, getEvents } from '../../firebase/events';
import { uploadToImgur } from '../../lib/imgur';
import Image from 'next/image';

const targetAudienceOptions = [
  { value: 'siaga', label: 'Siaga (7-10 tahun)' },
  { value: 'penggalang', label: 'Penggalang (11-15 tahun)' },
  { value: 'penegak', label: 'Penegak (16-20 tahun)' },
  { value: 'pandega', label: 'Pandega (21-25 tahun)' },
  { value: 'dewasa', label: 'Anggota Dewasa' },
  { value: 'pembina', label: 'Pembina' },
  { value: 'pelatih', label: 'Pelatih' }
];

export default function EventEditor() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'other',
    image: '/',
    category: '',
    capacity: 0,
    registrationLink: '',
    targetAudience: []
  });

  // Protect the route - redirect if not admin
  if (!user) {
    router.push('/login');
    return null;
  }

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsList = await getEvents();
      setEvents(eventsList);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please drop an image file');
      return;
    }
    
    await handleImageUpload(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    await handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to Imgur
      const imageUrl = await uploadToImgur(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update the event data with the new image URL
      setEventData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      // Clear progress after a short delay
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setUploadProgress(null);
    }
  };

  const resetForm = () => {
    setEventData({
      title: '',
      description: '',
      date: '',
      location: '',
      type: 'other',
      image: '/images/hero0.jpeg',
      category: '',
      capacity: '',
      registrationLink: '',
      targetAudience: []
    });
    setEditingId(null);
  };

  const handleEdit = (event) => {
    setEventData(event);
    setEditingId(event.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      await fetchEvents();
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetAudience') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setEventData(prev => ({
        ...prev,
        targetAudience: selectedOptions
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventDataToSubmit = {
        ...eventData,
        capacity: eventData.capacity ? eventData.capacity : null,
        registrationLink: eventData.registrationLink ? eventData.registrationLink : null
      };

      if (editingId) {
        // Update existing event
        await updateEvent(editingId, eventDataToSubmit);
        alert('Event updated successfully');
      } else {
        // Create new event
        await addEvent(eventDataToSubmit);
        alert('Event created successfully');
      }
      
      resetForm();
      await fetchEvents();
      router.refresh();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h1>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleEventChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleEventChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={handleEventChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleEventChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={eventData.category}
                onChange={handleEventChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                <option value="Diklat">Diklat</option>
                <option value="Perkemahan">Perkemahan</option>
                <option value="Lomba">Lomba</option>
                <option value="Bakti Sosial">Bakti Sosial</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity (optional)
              </label>
              <input
                type="number"
                name="capacity"
                value={eventData.capacity}
                onChange={handleEventChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Registration Link (optional)
              </label>
              <input
                type="url"
                name="registrationLink"
                value={eventData.registrationLink}
                onChange={handleEventChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 dark:border-gray-600'
                } ${
                  eventData.image ? 'h-[300px]' : 'h-[200px]'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadProgress !== null && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div
                          className="h-full bg-primary rounded transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {eventData.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={eventData.image}
                      alt="Event cover"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setEventData(prev => ({ ...prev, image: '/images/hero0.jpeg' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop an image here, or click to select</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg cursor-pointer transition-colors"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Audience
              </label>
              <select
                name="targetAudience"
                multiple
                value={eventData.targetAudience}
                onChange={handleEventChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                size={5}
              >
                {targetAudienceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hold Ctrl (Windows) or Command (Mac) to select multiple audiences
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>

        {/* Events List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Existing Events</h2>
          <div className="grid gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
                    <div className="flex gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                      <span>{event.type}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.targetAudience.map(audience => (
                        <span key={audience} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
