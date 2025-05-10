'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { getImages, deleteImage } from '../firebase/gallery';
import CreateContentButton from '../components/CreateContentButton';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchImages();
  }, []);

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
    if (!user || !confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteImage(id);
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Galeri Foto
            </h1>
            {user && (
              <CreateContentButton
                href="/editor/gallery"
                text="Tambah Foto"
              />
            )}
          </div>
          
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
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
            >
              <Image
                src={image.url}
                alt={image.title || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {image.title && (
                    <h3 className="text-white font-semibold mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-gray-200 text-sm mb-2">{image.description}</p>
                  )}
                  <span className="inline-block px-2 py-1 bg-primary/80 text-white text-xs rounded">
                    {image.category}
                  </span>
                  
                  {user && (
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
