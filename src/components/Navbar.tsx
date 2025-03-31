// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // login status
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      
      // redirect if not on login page and not logged in
      if (pathname !== '/' && !token) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [pathname]);

  // no navbar on login page
  if (pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Finance Manager</div>
          
          <div className="flex space-x-4">
            <Link 
              href="/dashboard" 
              className={`px-3 py-1 rounded ${pathname === '/dashboard' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/accounts" 
              className={`px-3 py-1 rounded ${pathname === '/accounts' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
            >
              Accounts
            </Link>
            <Link 
              href="/transactions" 
              className={`px-3 py-1 rounded ${pathname === '/transactions' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
            >
              Transactions
            </Link>
            <Link 
              href="/uploads" 
              className={`px-3 py-1 rounded ${pathname === '/uploads' ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
            >
              Uploads
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}