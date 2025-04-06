'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UpdateNoteRequest } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import './edit-note.css';

const EditNotePage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNote = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api-einstaklingsverkefni-veff2.onrender.com/notes/${noteId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
  
      const noteData = await response.json();
  
      setTitle(noteData.title);
      setContent(noteData.content);
  
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load note data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!noteId || !token) return;
    fetchNote();
  }, [noteId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    if (!user || !token) {
      setError('You must be logged in to edit a note');
      return;
    }

    if (!id || !noteId) {
      setError('Missing notepad or note ID');
      return;
    }

    setLoading(true);

    try {
      const noteData: UpdateNoteRequest = { 
        title, 
        content 
      };
      
      const updateResponse = await fetch(
        `https://api-einstaklingsverkefni-veff2.onrender.com/notes/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update note');
      }

      router.push(`/my-notepads/${id}/notes`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <h1>Edit Note</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            rows={8}
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditNotePage;