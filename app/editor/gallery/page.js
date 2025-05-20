'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { addImage } from '../../firebase/gallery';
import { uploadToImgur } from '../../lib/imgur';
import { uploadVideo } from '../../lib/videodb';
import Image from 'next/image';

const categoryOptions = [
  { value: 'siaga', label: 'Siaga' },
  { value: 'penggalang', label: 'Penggalang' },
  { value: 'penegak', label: 'Penegak' },
  { value: 'pandega', label: 'Pandega' },
  { value: 'pembina', label: 'Pembina' },
  { value: 'kegiatan-umum', label: 'Kegiatan Umum' },
  { value: 'lainnya', label: 'Lainnya' }
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg'
];

export default function GalleryEditor() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [imageData, setImageData] = useState({
    title: '',
    description: '',
    category: '',
    url: '',
    type: 'image' // default to image
  });

  // Protect the route
  if (!user) {
    router.push('/login');
    return null;
  }

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
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setMediaType('image');
      await handleImageUpload(file);
    } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setMediaType('video');
      await handleVideoUpload(file);
    } else {
      alert('Please drop an image or video file');
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setMediaType('image');
      await handleImageUpload(file);
    } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setMediaType('video');
      await handleVideoUpload(file);
    } else {
      alert('Please select an image or video file');
    }
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
      
      // Update the image data with the new URL
      setImageData(prev => ({
        ...prev,
        url: imageUrl
      }));
      
      // Clear progress after a short delay
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setUploadProgress(null);
    }
  };

  const handleVideoUpload = async (file) => {
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

      // Upload to ImageKit
      const result = await uploadVideo(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update the image data with the new URL and type
      setImageData(prev => ({
        ...prev,
        url: result.url,
        type: 'video',
        thumbnailUrl: result.thumbnailUrl
      }));
      
      // Clear progress after a short delay
      setTimeout(() => setUploadProgress(null), 1000);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video: ' + error.message);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!imageData.url) {
      alert('Please upload an image first');
      return;
    }
    if (!imageData.category) {
      alert('Please select a category');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Add timestamp to the image data
      const imageDataWithTimestamp = {
        ...imageData,
        createdAt: new Date().toISOString()
      };
      
      await addImage(imageDataWithTimestamp);
      alert('Image added successfully');
      router.push('/gallery');
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Failed to add image: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Add New Gallery Media
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={imageData.title}
                onChange={(e) => setImageData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                value={imageData.description}
                onChange={(e) => setImageData(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={imageData.category}
                onChange={(e) => setImageData(prev => ({ ...prev, category: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Media
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 dark:border-gray-600'
                } ${
                  imageData.url ? 'h-[300px]' : 'h-[200px]'
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
                
                {imageData.url ? (
                  <div className="relative w-full h-full">
                    {mediaType === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={imageData.url}
                          controls
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {imageData.thumbnailUrl && (
                          <Image
                            src={imageData.thumbnailUrl}
                            alt={imageData.title || 'Video thumbnail'}
                            fill
                            className="object-cover rounded-lg opacity-0"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                      </div>
                    ) : (
                      <Image
                        src={imageData.url}
                        alt={imageData.title || 'Gallery preview'}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImageData(prev => ({ ...prev, url: '', type: 'image' }));
                        setMediaType(null);
                      }}
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
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop an image or video here, or click to select</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Supported formats: Images, MP4, WebM, OGG (max 100MB)</p>
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm,video/ogg"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg cursor-pointer transition-colors"
                    >
                      Choose Media
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !imageData.url}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
