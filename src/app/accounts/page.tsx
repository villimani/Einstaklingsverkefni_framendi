'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Simple Account type
type Account = {
  name: string;
  balance: string;
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Create a new account
  const [showForm, setShowForm] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    // Fetch accounts
    fetchAccounts();
  }, []);

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/account/getallaccounts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(data.result || []);
    } catch (err) {
      setError('Could not load accounts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          accountName,
          balance: parseFloat(accountBalance)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      // Reset form and refresh accounts
      setAccountName('');
      setAccountBalance('');
      setShowForm(false);
      fetchAccounts();
    } catch (err) {
      setError('Could not create account');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Accounts</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
        >
          {showForm ? 'Cancel' : 'Add New Account'}
        </button>
        
        {showForm && (
          <form onSubmit={handleCreateAccount} className="p-4 border rounded mb-4">
            <div className="mb-3">
              <label className="block mb-1">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Initial Balance</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="border p-2 w-full rounded"
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded">
              Create Account
            </button>
          </form>
        )}
      </div>

      {isLoading ? (
        <p>Loading accounts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : accounts.length === 0 ? (
        <p>No accounts found. Create your first account!</p>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{account.name}</h2>
              <p className="text-lg">Balance: ${parseFloat(account.balance).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link href="/dashboard" className="text-blue-500">Back to Dashboard</Link>
      </div>
    </div>
  );
}