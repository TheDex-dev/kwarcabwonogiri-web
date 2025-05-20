'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { getImages, deleteImage } from '../firebase/gallery';
import CreateContentButton from '../components/CreateContentButton';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchImages();
  }, []);

  // Auto-navigation effect
  useEffect(() => {
    if (images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(images.length, 5));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [images]);

  const fetchImages = async () => {
    try {
      const fetchedImages = await getImages();
      setImages(fetchedImages);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(fetchedImages.map(img => img.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!user || !confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteImage(id);
      await fetchImages();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleMediaClick = (image) => {
    if (image.type === 'video') {
      setSelectedVideo(image);
    }
  };

  // Sort images by timestamp for recent media section
  const recentMedia = [...images]
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 5); // Limit to 5 items for better presentation

  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Galeri Media
            </h1>
            {user && (
              <CreateContentButton
                href="/editor/gallery"
                text="Tambah Media"
              />
            )}
          </div>

          {/* Featured Media Slider */}
          {recentMedia.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Media Terbaru</h2>
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-gray-900">
                <div 
                  className="absolute inset-0 flex transition-transform duration-700 ease-out will-change-transform"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {recentMedia.map((media, index) => (
                    <div
                      key={media.id}
                      className="relative w-full h-full flex-shrink-0"
                      style={{ width: '100%' }}
                      onClick={() => handleMediaClick(media)}
                    >
                      {media.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={media.thumbnailUrl || '/placeholder.jpg'}
                            alt={media.title || 'Video thumbnail'}
                            fill
                            sizes="100vw"
                            className="object-cover object-center"
                            priority={index === currentSlide}
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="p-4 bg-black/50 rounded-full">
                              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={media.url}
                          alt={media.title || 'Gallery image'}
                          fill
                          sizes="100vw"
                          className="object-cover object-center"
                          priority={index === currentSlide}
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h3 className="text-white text-2xl font-semibold mb-2">{media.title}</h3>
                        {media.description && (
                          <p className="text-gray-200 mb-3 line-clamp-2">{media.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-primary/90 text-white text-sm rounded-full">
                            {media.category}
                          </span>
                          {media.type === 'video' && (
                            <span className="px-3 py-1 bg-gray-800/90 text-white text-sm rounded-full">
                              Video
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === 0 ? recentMedia.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === recentMedia.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {recentMedia.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index
                          ? 'bg-white scale-110'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Semua
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map(image => (
            <div
              key={image.id}
              onClick={() => handleMediaClick(image)}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
            >
              {image.type === 'video' ? (
                <>
                  {image.thumbnailUrl ? (
                    <Image
                      src={image.thumbnailUrl}
                      alt={image.title || 'Video thumbnail'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3 bg-black/80 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <Image
                  src={image.url}
                  alt={image.title || 'Gallery image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {image.title && (
                    <h3 className="text-white font-semibold mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-gray-200 text-sm mb-2">{image.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-1 bg-primary/80 text-white text-xs rounded">
                      {image.category}
                    </span>
                    {image.type === 'video' && (
                      <span className="inline-block px-2 py-1 bg-gray-800/80 text-white text-xs rounded">
                        Video
                      </span>
                    )}
                  </div>
                </div>
                
                {user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video bg-black"
              onClick={e => e.stopPropagation()}
            >
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="w-full h-full"
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 p-2 bg-white text-gray-900 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
