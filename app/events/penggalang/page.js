'use client';

import { useState, useEffect } from 'react';
import { getEventsByType } from '../../firebase/events';
import CreateContentButton from '../../components/CreateContentButton';

export default function PenggalangPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        console.log('Fetching penggalang events...');
        const data = await getEventsByType('penggalang');
        console.log('Fetched events:', data);
        setEvents(data || []);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if the event targets penggalang audience
    const targetsPenggalang = event.targetAudience && 
                             Array.isArray(event.targetAudience) && 
                             event.targetAudience.includes('penggalang');
    
    const matchesCategory = categoryFilter === 'all' || 
                           (event.category && event.category === categoryFilter);
    
    if (dateFilter === 'all') return matchesSearch && matchesCategory && targetsPenggalang;
    
    const eventDate = new Date(event.date);
    const today = new Date();
    
    switch(dateFilter) {
      case 'upcoming':
        return matchesSearch && matchesCategory && targetsPenggalang && eventDate >= today;
      case 'past':
        return matchesSearch && matchesCategory && targetsPenggalang && eventDate < today;
      default:
        return matchesSearch && matchesCategory && targetsPenggalang;
    }
  });

  const renderEventCountSummary = () => {
    const upcomingCount = events.filter(event => new Date(event.date) >= new Date()).length;
    const pastCount = events.filter(event => new Date(event.date) < new Date()).length;

    return (
      <div className="flex justify-center gap-6 mb-8">
        <div className="text-center">
          <span className="block text-3xl font-bold text-primary">{upcomingCount}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</span>
        </div>
        <div className="text-center">
          <span className="block text-3xl font-bold text-gray-600 dark:text-gray-300">{pastCount}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Past Events</span>
        </div>
        <div className="text-center">
          <span className="block text-3xl font-bold text-blue-600">{events.length}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Events</span>
        </div>
      </div>
    );
  };

  const categories = ['Diklat', 'Perkemahan', 'Lomba', 'Bakti Sosial', 'Lainnya'];

  const getTargetAudienceLabels = (targetAudience) => {
    const labels = {
      siaga: 'Siaga',
      penggalang: 'Penggalang',
      penegak: 'Penegak',
      pandega: 'Pandega',
      dewasa: 'Anggota Dewasa',
      pembina: 'Pembina',
      pelatih: 'Pelatih'
    };
    return Array.isArray(targetAudience) 
      ? targetAudience.map(t => labels[t] || t).join(', ')
      : '';
  };

  const shareEvent = async (event) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title} at ${event.location} on ${new Date(event.date).toLocaleDateString()}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const shareText = `${event.title}\n${event.location}\n${new Date(event.date).toLocaleDateString()}`;
      await navigator.clipboard.writeText(shareText);
      alert('Event details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Kegiatan Penggalang</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Program kegiatan untuk anggota Pramuka tingkat Penggalang di Kwartir Cabang Wonogiri
        </p>
      </div>

      {renderEventCountSummary()}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Dates</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  {new Date(event.date) >= new Date() && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                      Upcoming
                    </span>
                  )}
                </div>
                {event.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 mb-2">
                    {event.category}
                  </span>
                )}
                {event.targetAudience && event.targetAudience.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Target: {getTargetAudienceLabels(event.targetAudience)}
                    </span>
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>📅 {new Date(event.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p>📍 {event.location}</p>
                  {event.capacity && <p>👥 Capacity: {event.capacity} participants</p>}
                </div>
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Register Now
                  </a>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => shareEvent(event)}
                    className="text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Event
                  </button>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEvent.title}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{selectedEvent.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p>📅 {new Date(selectedEvent.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p>📍 {selectedEvent.location}</p>
                {selectedEvent.capacity && <p>👥 Capacity: {selectedEvent.capacity} participants</p>}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => shareEvent(selectedEvent)}
                  className="px-4 py-2 text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Event
                </button>
                {selectedEvent.registrationLink && (
                  <a
                    href={selectedEvent.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateContentButton eventType="penggalang" />
    </div>
  );
}