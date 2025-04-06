'use client';

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import "./registration.css";

export default function Registration() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page-container">
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
    </div>
  );
}