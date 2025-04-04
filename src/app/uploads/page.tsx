'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './uploads.css';

export default function UploadsPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchImages();
  }, [router]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/images', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError('Could not load images');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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

      if (!response.ok) throw new Error('Failed to upload image');

      setSelectedFile(null);
      if (e.target instanceof HTMLFormElement) e.target.reset();
      fetchImages();
    } catch (err) {
      setError('Could not upload image');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="uploads-container">
      <h1 className="uploads-title">Image Uploads</h1>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="form-group">
          <label className="form-label">Select Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="form-input"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {isLoading ? (
        <p className="loading-message">Loading images...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((imageUrl, index) => (
            <div key={index} className="gallery-item">
              <img
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                className="gallery-image"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push('/dashboard')}
        className="btn btn-back"
      >
        Back to Dashboard
      </button>
    </div>
  );
}