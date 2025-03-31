'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UploadsPage() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    // Fetch existing images
    fetchImages();
  }, []);

  // Fetch images from API
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/images', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError('Could not load images');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Reset file input and refresh images
      setSelectedFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
      fetchImages();
    } catch (err) {
      setError('Could not upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image Uploads</h1>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 p-4 border rounded">
        <div className="mb-3">
          <label className="block mb-1">Select Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {/* Image gallery */}
      {isLoading ? (
        <p>Loading images...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <img
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link href="/dashboard" className="text-blue-500">Back to Dashboard</Link>
      </div>
    </div>
  );
}