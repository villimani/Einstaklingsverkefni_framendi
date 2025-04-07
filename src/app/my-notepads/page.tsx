'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Notepad, PaginatedResponse } from '@/types/note';
import './my-notepads.css';

const UserNotepadsPage = () => {
  const [notepads, setNotepads] = useState<Notepad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [showManage, setShowManage] = useState(false);
  const router = useRouter();

  const fetchNotepads = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(
        `https://api-einstaklingsverkefni-veff2.onrender.com/user/notepads?page=${page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaginatedResponse<Notepad> = await response.json();
      setNotepads(data.data);

      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination.totalPages,
      }));
    } catch {
      setError('Failed to fetch notepads');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, router]);

  useEffect(() => {
    fetchNotepads(pagination.page);
  }, [pagination.page, fetchNotepads]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this notepad?');
    if (!confirmed) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    try {
      const response = await fetch(`https://api-einstaklingsverkefni-veff2.onrender.com/notepads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete notepad');
      }
  
      // Calculate if we need to change pages
      const willLastItemOnPageBeDeleted = notepads.length === 1 && pagination.page > 1;
      
      if (willLastItemOnPageBeDeleted) {
        // Move to previous page if we deleted the last item on the current page
        const newPage = pagination.page - 1;
        setPagination(prev => ({ ...prev, page: newPage }));
        await fetchNotepads(newPage);
      } else {
        // Otherwise, refetch current page
        await fetchNotepads(pagination.page);
      }
    } catch (error) {
      console.error('Delete errors:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete notepad');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="user-notepads-container">

      <div className="actions-bar">
        <Link href="/my-notepads/new" className="create-link-1">
          + Create New Notepad
        </Link>
        <button onClick={() => setShowManage(!showManage)} className="manage-button-1">
          {showManage ? 'View Mode' : 'Manage Mode'}
        </button>
      </div>

      <div className="notepads-list">
        {notepads.length === 0 ? (
          <p>You don&apos;t have any notepads yet.</p>
        ) : (
          <ul>
            {notepads.map((notepad) => (
              <li key={notepad.id} className="notepad-item">
                <div className="notepad-header">
                  <h3>{notepad.title}</h3>
                  {!notepad.isPublic && <span className="private-badge">Private</span>}
                </div>
                <p className="description">{notepad.description}</p>
                <div className="notepad-actions">
                  <Link href={`/my-notepads/${notepad.id}/notes`} className="view-link-1">
                    View Notes
                  </Link>
                  {showManage && (
                    <>
                      <Link href={`/my-notepads/${notepad.id}/edit`} className="edit-link-1">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(notepad.id)}
                        className="delete-button-1"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="page-button-1"
          >
            Previous
          </button>
          <span className="page-info">
            {`Page ${pagination.page} of ${pagination.totalPages}`}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="page-button-1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNotepadsPage;