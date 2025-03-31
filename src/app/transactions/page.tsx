"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Simple types
type Account = {
  id: number;
  name: string;
  balance: string;
};

type Category = {
  name: string;
};

type Transaction = {
  amount: string;
  transaction_type: "income" | "expense";
  category_name: string;
  account_balance: string;
};

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // New transaction form
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("1"); // Default to first category
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Fetch accounts and categories
    fetchAccounts();
    fetchCategories();
  }, []);

  // When an account is selected, fetch its transactions
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount);
    }
  }, [selectedAccount]);

  //log account
  console.log("Accounts:", accounts);
  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/account/getallaccounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await response.json();
      console.log("acounts data", data), setAccounts(data.result || []);

      // Select first account by default if available
      if (data.result && data.result.length > 0) {
        setSelectedAccount("1"); // Assuming the first account has ID 1
      }
    } catch (err) {
      setError("Could not load accounts");
      console.error(err);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Could not load categories", err);
    }
  };

  // Fetch transactions for a specific account
  const fetchTransactions = async (accountId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/account/${accountId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.accountTransactions || []);
    } catch (err) {
      setError("Could not load transactions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new transaction
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Creating transaction for account ID:", selectedAccount);
    console.log("Transaction data:", {
      amount: parseFloat(amount),
      category_id: parseInt(categoryId),
      transaction_type: transactionType,
      description,
    });
    try {
      const url = `/api/account/${selectedAccount}/transaction`;
      console.log("Request URL:", url);
      const response = await fetch(
        `/api/account/${selectedAccount}/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            category_id: parseInt(categoryId),
            transaction_type: transactionType,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      // Reset form and refresh transactions
      setAmount("");
      setDescription("");
      setShowForm(false);
      fetchTransactions(selectedAccount);
    } catch (err) {
      setError("Could not create transaction");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {/* Account selector */}
      <div className="mb-4">
        <label className="block mb-1">Select Account:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select an account --</option>
          {accounts.map((account, index) => (
            <option key={index} value={account.id.toString()}>
              {account.name} (${parseFloat(account.balance).toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {/* New transaction button & form */}
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

      {/* Transactions list */}
      {selectedAccount &&
        (isLoading ? (
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
        ))}

      <div className="mt-4">
        <Link href="/dashboard" className="text-blue-500">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
