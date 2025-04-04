"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/types/accounts";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import "./accounts.css";

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
    <div className="accounts-container">
      <h1 className="accounts-title">Your Accounts</h1>

      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "Add New Account"}
        </button>

        {showForm && (
          <form onSubmit={handleCreateAccount} className="account-form">
            <div className="form-group">
              <label className="form-label">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Balance</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="form-input"
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Create Account
            </button>
          </form>
        )}
      </div>

      {isLoading ? (
        <p className="loading-message">Loading accounts...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : accounts.length === 0 ? (
        <p>No accounts found. Create your first account!</p>
      ) : (
        <div className="accounts-grid">
          {accounts.map((account, index) => (
            <div key={index} className="account-card">
              <h2 className="account-name">{account.name}</h2>
              <p className="account-balance">
                Balance: ${parseFloat(account.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/dashboard")}
        className="btn btn-back"
      >
        Back to Dashboard
      </button>
    </div>
  );
}