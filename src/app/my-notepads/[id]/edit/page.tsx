'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UpdateNotepadRequest } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import './edit.css';

const EditNotepadPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof id === 'string' && token) {
      const fetchNotepad = async () => {
        setLoading(true);
        setError('');
        try {
          const notepadResponse = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!notepadResponse.ok) throw new Error('Notepad not found');

          const notepadData = await notepadResponse.json();

          setTitle(notepadData.title);
          setDescription(notepadData.description);
          setIsPublic(notepadData.isPublic);
        } catch {
          setError('Failed to load notepad data');
        } finally {
          setLoading(false);
        }
      };

      fetchNotepad();
    }
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title) {
      setError('Title is required');
      return;
    }
  
    if (!user || !token) {
      setError('You must be logged in to edit a notepad');
      return;
    }
  
    if (!id) {
      setError('Notepad ID is required');
      return;
    }
  
    const idAsString = Array.isArray(id) ? id[0] : id;
    const notepadId = parseInt(idAsString);
  
    if (isNaN(notepadId)) {
      setError('Invalid Notepad ID');
      return;
    }
  
    setLoading(true);
    try {
      const notepadData: UpdateNotepadRequest = {
        title,
        description,
        isPublic,
      };
  
      const response = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${notepadId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notepadData),
      });

      if (!response.ok) throw new Error('Failed to update notepad');

      router.push('/my-notepads');
    } catch (error) {
      console.error('Error updating notepad:', error);
      setError(error instanceof Error ? error.message : 'Failed to update notepad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-notepad-container">
      <h1>Edit Notepad</h1>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditNotepadPage;