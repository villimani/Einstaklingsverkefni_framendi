"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Account } from "@/types/accounts";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState("");
  const { token, isLoading } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();

  // Fetch accounts from API
  const fetchAccounts = useCallback(async () => {
    try {
      const data = await apiFetch<{ result: Account[] }>(
        "/api/account/getallaccounts",
        token
      );
      setAccounts(data.result || []);
    } catch (err) {
      console.log(err);
      setError("Could not load accounts");
    }
  }, [token]);

  useEffect(() => {
    if (!token && !isLoading) {
      router.push("/");
    } else if (token) {
      fetchAccounts();
    }
  }, [token, isLoading, router, fetchAccounts]);

  // Create a new account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountName,
          balance: parseFloat(accountBalance),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      // Reset form and refresh accounts
      setAccountName("");
      setAccountBalance("");
      setShowForm(false);
      fetchAccounts();
    } catch (err) {
      setError("Could not create account");
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
          {showForm ? "Cancel" : "Add New Account"}
        </button>

        {showForm && (
          <form
            onSubmit={handleCreateAccount}
            className="p-4 border rounded mb-4"
          >
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
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-2 rounded"
            >
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
              <p className="text-lg">
                Balance: ${parseFloat(account.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link href="/dashboard" className="text-blue-500">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
