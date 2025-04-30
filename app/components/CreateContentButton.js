'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { addEvent } from '../firebase/events';

export default function CreateContentButton({ eventType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [contentType, setContentType] = useState(null); // 'article' or 'event'
  
  const [articleData, setArticleData] = useState({
    title: '',
    category: 'Berita',
    content: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    imageUrl: ''
  });

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: eventType || 'other',
    image: '/images/hero0.jpeg',
    category: '',
    capacity: '',
    registrationLink: '',
    targetAudience: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedContent = articleData.content
        .split('\n')
        .filter(line => line.trim())
        .join('\n\n');

      await addDoc(collection(db, 'articles'), {
        ...articleData,
        content: formattedContent,
        date: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      setIsModalOpen(false);
      setArticleData({
        title: '',
        category: 'Berita',
        content: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        imageUrl: ''
      });
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert capacity to null if empty
      const eventDataToSubmit = {
        ...eventData,
        capacity: eventData.capacity ? eventData.capacity : null,
        registrationLink: eventData.registrationLink ? eventData.registrationLink : null,
        type: eventType || eventData.type || 'other'
      };

      await addEvent(eventDataToSubmit);
      setIsModalOpen(false);
      setEventData({
        title: '',
        description: '',
        date: '',
        location: '',
        type: eventType || 'other',
        image: '/images/hero0.jpeg',
        category: '',
        capacity: '',
        registrationLink: '',
        targetAudience: []
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const targetAudienceOptions = [
    { value: 'siaga', label: 'Siaga (7-10 tahun)' },
    { value: 'penggalang', label: 'Penggalang (11-15 tahun)' },
    { value: 'penegak', label: 'Penegak (16-20 tahun)' },
    { value: 'pandega', label: 'Pandega (21-25 tahun)' },
    { value: 'dewasa', label: 'Anggota Dewasa' },
    { value: 'pembina', label: 'Pembina' },
    { value: 'pelatih', label: 'Pelatih' }
  ];

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetAudience') {
      // Handle multiple selections for targetAudience
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

  const handleContentTypeSelect = (type) => {
    setContentType(type);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleContentTypeSelect('event')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Create Event
            </button>
            <button
              onClick={() => handleContentTypeSelect('article')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Create Article
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold dark:text-white">
                Create New {contentType === 'article' ? 'Article' : 'Event'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {contentType === 'article' ? (
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={articleData.title}
                    onChange={handleArticleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Enter article title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={articleData.imageUrl}
                    onChange={handleArticleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={articleData.category}
                    onChange={handleArticleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={articleData.excerpt}
                    onChange={handleArticleChange}
                    required
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Brief summary of the article..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={articleData.content}
                    onChange={handleArticleChange}
                    required
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="Write your article content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Read Time
                  </label>
                  <select
                    name="readTime"
                    value={articleData.readTime}
                    onChange={handleArticleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="3 min read">3 min read</option>
                    <option value="5 min read">5 min read</option>
                    <option value="10 min read">10 min read</option>
                    <option value="15 min read">15 min read</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEventSubmit} className="space-y-4">
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
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
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  ></textarea>
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={eventData.image}
                    onChange={handleEventChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}