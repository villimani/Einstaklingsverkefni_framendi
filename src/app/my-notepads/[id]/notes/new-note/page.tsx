'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './new-note.css';  // Assuming you want to use the same styles
import { useAuth } from '@/context/AuthContext'; // Assuming you have an auth context

const CreateNotePage = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth(); // Get user and token from auth context

  // Get the dynamic id from the URL (e.g., /my-notepads/[id]/notes)
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      setError('Title is required');
      return;
    }

    if (!content) {
      setError('Content is required');
      return;
    }

    if (!user || !token) {
      setError('You must be logged in to create a note');
      return;
    }

    if (!id) {
      setError('Notepad ID is required');
      return;
    }

    setLoading(true);
    try {
      const noteData = {
        title: title,  // Title of the new note from the state
        content: content,  // Content of the new note from the state
      };

      const response = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${id}/notes`, {
        method: 'POST',  // Use POST for creating a new note
        headers: {
          Authorization: `Bearer ${token}`,  // Authentication token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),  // New note data
      });

      // Handle the response
      if (response.ok) {
        const newNote = await response.json();
        console.log('New note created:', newNote);
      } else {
        const errorData = await response.json();
        console.error('Error creating note:', errorData.error);
        setError('Failed to create note');
      }

      router.push(`/my-notepads/${id}/notes`);
    } catch (error) {
      console.error('Error creating note:', error);
      setError(error instanceof Error ? error.message : 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-notepad-container">
      <h1>Create a New Note</h1>
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
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotePage;
