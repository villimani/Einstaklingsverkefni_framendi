"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import "./styles.css"; // Make sure this path is correct

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="main-container">
      {/* Hero Image */}
      <div
        className="hero"
        style={{
          backgroundImage: 'url("/images/frontpage.jpg")',
        }}
      >
        <div className="hero-content">
          <h1>Take Control of Your Finances</h1>
          <h2>Finance Manager</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${showLogin ? 'active' : ''}`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!showLogin ? 'active' : ''}`}
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

        <div className="welcome-card">
          <h3>Welcome to Finance Manager</h3>
          <p>
            Track your spending, set budgets, and achieve your financial goals
            with our easy-to-use platform.
          </p>
          <ul className="feature-list">
            <li>Expense tracking</li>
            <li>Budget management</li>
            <li>Financial reports</li>
            <li>Goal setting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}