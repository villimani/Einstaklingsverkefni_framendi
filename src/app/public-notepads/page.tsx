'use client';

import { useState, useEffect } from 'react';
import { Notepad, PaginatedResponse } from '@/types/note';
import './public-notepads.css';

const PublicNotepadsPage = () => {
  const [notepads, setNotepads] = useState<Notepad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    totalPages: 1,
    limit: 12 
  });

  useEffect(() => {
    const fetchNotepads = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api-einstaklingsverkefni-veff2.onrender.com/public/notepads?page=${pagination.page}&limit=${pagination.limit}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PaginatedResponse<Notepad> = await response.json();
        setNotepads(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages
        }));
      } catch (err) {
        console.error("Error fetching public notepads:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch notepads');
      } finally {
        setLoading(false);
      }
    };

    fetchNotepads();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="public-notepads-container">
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="notepads-list">
            {notepads.length === 0 ? (
              <p>No public notepads found.</p>
            ) : (
              <ul>
                {notepads.map((notepad) => (
                  <li key={notepad.id} className="notepad-item">
                    <h3>{notepad.title}</h3>
                    <p className="description">{notepad.description}</p>
                    <a 
                      href={`/public-notepads/${notepad.id}/notes`} 
                      className="view-link"
                    >
                      View Notepad
                    </a>
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
                className="page-button"
              >
                Previous
              </button>
              <span className="page-info">
                {`Page ${pagination.page} of ${pagination.totalPages}`}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="page-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicNotepadsPage;