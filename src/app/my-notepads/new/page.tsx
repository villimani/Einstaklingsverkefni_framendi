'use client';

import React, { useState } from 'react';
import { CreateNotepadRequest } from '@/types/note';
import { createNotepad } from '@/lib/api';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
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
        title, 
        description, 
        isPublic, 
        ownerId: user.id 
      };
      
      await createNotepad(token, notepadData);
      router.push('/my-notepads');
    } catch (error) {
      console.error('Error creating notepad:', error);
      setError(error instanceof Error ? error.message : 'Failed to create notepad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-notepad-container">
      <h1>Create a New Notepad</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic((prev) => !prev)}
            />
            Public
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Notepad'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotepadPage;