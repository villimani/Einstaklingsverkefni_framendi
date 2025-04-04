"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Account, Category, Transaction } from "@/types/accounts";
import { apiFetch, getTransactions } from "@/lib/api";
import "./transactions.css";

export default function TransactionsPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [description, setDescription] = useState("");

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await apiFetch<{ result: Account[] }>(
        "/api/account/getallaccounts",
        token
      );
      setAccounts(data.result || []);
      return data.result || [];
    } catch (err) {
      console.error(err);
      setError("Could not load accounts");
      return [];
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiFetch<{ categories: Category[] }>(
        "/api/categories",
        token
      );
      setCategories(data.categories || []);
      return data.categories || [];
    } catch (err) {
      console.error(err);
      setError("Could not load categories");
      return [];
    }
  }, [token]);

  const fetchTransactions = useCallback(
    async (accountId: string) => {
      if (!token) return;

      setIsLoading(true);
      try {
        const data = await getTransactions(accountId, token);
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError("Could not load transactions");
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [accountRes] = await Promise.all([
          fetchAccounts(),
          fetchCategories(),
        ]);

        if (accountRes.length > 0) {
          const firstId = accountRes[0].id.toString();
          setSelectedAccount(firstId);
          await fetchTransactions(firstId);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load initial data");
      }
    };

    fetchData();
  }, [token, fetchAccounts, fetchCategories, fetchTransactions]);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount, fetchTransactions]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/account/${selectedAccount}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category_id: parseInt(categoryId),
          transaction_type: transactionType,
          description,
        }),
      });

      if (!res.ok) throw new Error("Failed to create transaction");

      setAmount("");
      setDescription("");
      setShowForm(false);
      fetchTransactions(selectedAccount);
    } catch (err) {
      console.error(err);
      setError("Could not create transaction");
    }
  };

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Transactions</h1>

      <div className="mb-4">
        <label className="form-label">Select Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="form-select"
        >
          <option value="">-- Select an account --</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id.toString()}>
              {account.name} (${parseFloat(account.balance).toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {selectedAccount && (
        <div className="mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
          >
            {showForm ? "Cancel" : "Add New Transaction"}
          </button>

          {showForm && (
            <form onSubmit={handleCreateTransaction} className="transaction-form">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  value={transactionType}
                  onChange={(e) =>
                    setTransactionType(e.target.value as "income" | "expense")
                  }
                  className="form-select"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="form-select"
                  required
                >
                  {categories.map((category, index) => (
                    <option key={index} value={(index + 1).toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-success">
                Create Transaction
              </button>
            </form>
          )}
        </div>
      )}

      {isLoading ? (
        <p className="loading-message">Loading transactions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found for this account.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    {transaction.transaction_type === "income" ? (
                      <span className="income-text">Income</span>
                    ) : (
                      <span className="expense-text">Expense</span>
                    )}
                  </td>
                  <td>${Math.abs(parseFloat(transaction.amount)).toFixed(2)}</td>
                  <td>{transaction.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
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