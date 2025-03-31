"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Account, Category, Transaction } from "@/types/accounts";
import { apiFetch, getTransactions } from "@/lib/api";

export default function TransactionsPage() {
  const { token } = useAuth();

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
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
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
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <div className="mb-4">
        <label className="block mb-1">Select Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="border p-2 rounded w-full"
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
            className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
          >
            {showForm ? "Cancel" : "Add New Transaction"}
          </button>

          {showForm && (
            <form
              onSubmit={handleCreateTransaction}
              className="p-4 border rounded mb-4"
            >
              <div className="mb-3">
                <label className="block mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border p-2 w-full rounded"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Type</label>
                <select
                  value={transactionType}
                  onChange={(e) =>
                    setTransactionType(e.target.value as "income" | "expense")
                  }
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                >
                  {categories.map((category, index) => (
                    <option key={index} value={(index + 1).toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-2 rounded"
              >
                Create Transaction
              </button>
            </form>
          )}
        </div>
      )}

      {isLoading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found for this account.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Amount</th>
                <th className="border p-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    {transaction.transaction_type === "income" ? (
                      <span className="text-green-600">Income</span>
                    ) : (
                      <span className="text-red-600">Expense</span>
                    )}
                  </td>
                  <td className="border p-2">
                    ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                  </td>
                  <td className="border p-2">{transaction.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
