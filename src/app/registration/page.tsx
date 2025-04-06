"use client";

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";  // Make sure you have this component
import LoginForm from "@/components/LoginForm";  // You may want to add a login form if needed
import "./registration.css";

export default function Registration() {
  const [showLogin, setShowLogin] = useState(true); // Default to showing Login

  return (
    <div className="main-container">
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
          <h3>Welcome to Notepad Manager</h3>
          <p>
            Manage your notes, stay organized, and access your notes from anywhere.
          </p>
          <ul className="feature-list">
            <li>Easy note creation</li>
            <li>Share your notes</li>
            <li>Manage multiple notepads</li>
            <li>Secure access with login</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
