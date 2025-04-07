'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Notepad, Note, PaginatedResponse } from '@/types/note';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './notepad-notes.css';

const NotepadNotesPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const notepadId = params.id as string;
  
  const [notepad, setNotepad] = useState<Notepad | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    
    setPagination(prev => ({
      ...prev,
      page,
      limit
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [notepadResponse, notesResponse] = await Promise.all([
          fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${notepadId}`),
          fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${notepadId}/notes?page=${pagination.page}&limit=${pagination.limit}`)
        ]);
        
        if (!notepadResponse.ok) throw new Error('Notepad not found');
        if (!notesResponse.ok) throw new Error('Failed to fetch notes');
        
        const notepadData = await notepadResponse.json();
        const notesData: PaginatedResponse<Note> = await notesResponse.json();
        
        setNotepad(notepadData);
        setNotes(notesData.data);
        setPagination(prev => ({
          ...prev,
          total: notesData.pagination.total,
          totalPages: notesData.pagination.totalPages
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [notepadId, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setExpandedNoteId(null);
      router.push(`/public-notepads/${notepadId}/notes?page=${newPage}&limit=${pagination.limit}`);
    }
  };

  const toggleNote = (noteId: number) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDelete = async (noteId: number) => {
    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete note');

      // Refresh the notes list
      const notesResponse = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${notepadId}/notes?page=${pagination.page}&limit=${pagination.limit}`);
      const notesData: PaginatedResponse<Note> = await notesResponse.json();
      setNotes(notesData.data);
      setPagination(prev => ({
        ...prev,
        total: notesData.pagination.total,
        totalPages: notesData.pagination.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  if (loading) return <div className="container-2">Loading...</div>;
  if (error) return <div className="container-2 error">{error}</div>;

  return (
    <div className="container-2">
      
      {notepad && (
        <div className="notepad-header">
          <h1>{notepad.title}</h1>
          <div className="notepad-meta">
            <span>Total Notes: {pagination.total}</span>
          </div>
        </div>
      )}

      <div className="actions-bar-1">
        <Link href={`/my-notepads/${notepadId}/notes/new-note`} className="create-link-2">
          + Create New Note
        </Link>
        <button 
          onClick={() => setShowManage(!showManage)} 
          className="manage-button-2"
        >
          {showManage ? 'View Mode' : 'Manage Mode'}
        </button>
      </div>
      
      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes found in this notepad.</p>
        ) : (
          <>
            <ul>
              {notes.map((note) => (
                <li 
                  key={note.id} 
                  className={`note-item ${expandedNoteId === note.id ? 'expanded' : ''}`}
                  onClick={() => !showManage && toggleNote(note.id)}
                >
                  <div className="note-header">
                    <h2 className="note-title">{note.title}</h2>
                    {!showManage && (
                      <svg 
                        className="chevron"
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className={`note-content ${expandedNoteId === note.id ? 'expanded' : ''}`}>
                    {note.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph || <br />}</p>
                    ))}
                  </div>
                  {showManage && (
                    <div className="note-actions">
                      <Link 
                        href={`/my-notepads/${notepadId}/notes/${note.id}/edit-note`} 
                        className="edit-link-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="delete-button-2"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="page-button-2"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="page-button-2"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotepadNotesPage;