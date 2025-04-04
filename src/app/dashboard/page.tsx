"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/unauthorized");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout(); 
      router.push("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/"); 
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card-title">
          Welcome, {user.username}!
        </h2>
        <p>You are now logged in to the Finance Manager app.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Accounts</h2>
          <p>Manage your financial accounts and track your balances.</p>
          <button
            onClick={() => handleNavigation('/accounts')}
            className="nav-button"
          >
            View Accounts
          </button>
        </div>

        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Transactions</h2>
          <p>Record and categorize all of your income and expenses.</p>
          <button
            onClick={() => handleNavigation('/transactions')}
            className="nav-button"
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
}