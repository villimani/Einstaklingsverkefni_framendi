'use client';

import React, { useState } from 'react';
import { CreateNotepadRequest } from '@/types/note';
import { useRouter } from 'next/navigation';
import './new.css';
import { useAuth } from '@/context/AuthContext';

const CreateNotepadPage = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user, token } = useAuth();

  const createNotepad = async (token: string, notepadData: CreateNotepadRequest) => {
    const response = await fetch('https://api-einstaklingsverkefni-veff2.onrender.com/notepads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notepadData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create notepad');
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Validate inputs
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!user || !token) {
      setError('You must be logged in to create a notepad');
      return;
    }

    setLoading(true);

    try {
      const notepadData: CreateNotepadRequest = { 
        title: title.trim(), 
        description: description.trim(), 
        isPublic, 
        ownerId: user.id 
      };
      
      const result = await createNotepad(token, notepadData);
      
      // Redirect only after successful creation
      if (result?.id) {
        router.push('/my-notepads');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error creating notepad:', error);
      setError(error instanceof Error ? error.message : 'Failed to create notepad');
      
      // If there's a network error, suggest checking connection
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-notepad-container">
      <h1>Create a New Notepad</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={() => setError('')}
            className="dismiss-error"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            maxLength={500}
            rows={4}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              disabled={loading}
            />
            <span>Make this notepad public</span>
          </label>
          <p className="hint">
            {isPublic 
              ? 'Anyone can view this notepad' 
              : 'Only you can view this notepad'}
          </p>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || !title.trim()}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              'Create Notepad'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={() => router.back()}
            disabled={loading}
            className="secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotepadPage;