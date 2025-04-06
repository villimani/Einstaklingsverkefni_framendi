// app/page.js
"use client";

import './styles.css'; // Import your existing CSS file

export default function Home() {
  return (
    <div className="main-container">
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
  );
}