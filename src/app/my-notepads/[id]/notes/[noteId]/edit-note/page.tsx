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

  // Get noteId and notepadId from URL parameters
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;

  // States for form data and error handling
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the note when the page loads or when noteId or token changes
  useEffect(() => {
    if (!noteId || !token) return;

    const fetchNote = async () => {
      setLoading(true);
      setError('');

      try {
        const parsedId = parseInt(noteId as string);
        if (isNaN(parsedId)) throw new Error('Invalid note ID');

        // API call to get the note by ID
        const response = await fetch(
          `https://api-einstaklingsverkefni-veff2.onrender.com/notes/${noteId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch note');

        const noteData = await response.json();

        // Log the fetched note data
        console.log('Fetched note data:', noteData);

        if (!noteData) {
          throw new Error('Note not found');
        }

        // Populate the form with the fetched data
        setTitle(noteData.title);
        setContent(noteData.content);
      } catch (error) {
        console.error('Error fetching note:', error);
        setError(error instanceof Error ? error.message : 'Failed to load note data');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, token]);

  // Handle form submission (updating the note)
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
      const noteData: UpdateNoteRequest = { title, content };

      // API call to update the note
      const updateResponse = await fetch(
        `https://api-einstaklingsverkefni-veff2.onrender.com/notes/${noteId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(noteData),
        }
      );

      if (!updateResponse.ok) throw new Error('Failed to update note');

      // Redirect to the notepad page after successfully updating the note
      router.push(`/my-notepads/${id}/notes`);
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error instanceof Error ? error.message : 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-note-container">
      <h1>Edit Note</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditNotePage;
