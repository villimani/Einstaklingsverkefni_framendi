'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto pt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Finance Manager</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${showLogin ? 'font-bold border-b-2 border-blue-500' : ''}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${!showLogin ? 'font-bold border-b-2 border-blue-500' : ''}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>
        
        {showLogin ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={() => setShowLogin(true)} />
        )}
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Welcome to Finance Manager</h2>
        <p>
          Track your spending, set budgets, and achieve your financial goals with our easy-to-use platform.
        </p>
      </div>
    </div>
  );
}