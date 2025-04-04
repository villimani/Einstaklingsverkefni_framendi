"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      
      if (!token && 
          (pathname === '/dashboard' || 
           pathname === '/accounts' || 
           pathname === '/transactions' || 
           pathname === '/uploads')) {
        router.push('/unauthorized');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [pathname, router]);

  if (pathname === "/" || pathname === "/unauthorized") {
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-brand">Finance Manager</div>

          {isLoggedIn && (
            <div className="nav-buttons">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className={`nav-button ${pathname === "/dashboard" ? "active" : ""}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('/accounts')}
                className={`nav-button ${pathname === "/accounts" ? "active" : ""}`}
              >
                Accounts
              </button>
              <button
                onClick={() => handleNavigation('/transactions')}
                className={`nav-button ${pathname === "/transactions" ? "active" : ""}`}
              >
                Transactions
              </button>
              <button
                onClick={() => handleNavigation('/uploads')}
                className={`nav-button ${pathname === "/uploads" ? "active" : ""}`}
              >
                Uploads
              </button>
              <button
                onClick={handleLogout}
                className="nav-logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}