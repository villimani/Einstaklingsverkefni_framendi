'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Connect to your API
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Save user data and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard (we'll create this page next)
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}