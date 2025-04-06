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
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      // Redirect to '/unauthorized' if not logged in and trying to access private pages
      if (!token && pathname === "/my-notepads") {
        router.push("/unauthorized");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  }, [pathname, router]);

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
          <div className="nav-brand">Notepad Manager</div>

          <div className="nav-buttons">
            <button
              onClick={() => handleNavigation("/public-notepads")}
              className={`nav-button ${pathname === "/public-notepads" ? "active" : ""}`}
            >
              Public Notepads
            </button>
            
            <button
              onClick={() => handleNavigation(isLoggedIn ? "/my-notepads" : "/registration")} // Redirect to /registration if not logged in
              className={`nav-button ${pathname === (isLoggedIn ? "/my-notepads" : "/registration") ? "active" : ""}`}
            >
              {isLoggedIn ? "My Notepads" : "Login"}
            </button>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="nav-logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
