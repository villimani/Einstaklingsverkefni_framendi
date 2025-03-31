"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {/* Hero Image */}
      <div
        className="w-full"
        style={{
          height: "400px",
          backgroundImage: 'url("/images/frontpage.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
          <h1 className="text-4xl font-bold drop-shadow-md mb-2">
            Take Control of Your Finances
          </h1>
          <h2 className="text-2xl font-semibold drop-shadow-md">
            Finance Manager
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                showLogin ? "font-bold border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !showLogin ? "font-bold border-b-2 border-blue-500" : ""
              }`}
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
        <div className="max-w-md w-full pt-10">
          <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              Welcome to Finance Manager
            </h3>
            <p>
              Track your spending, set budgets, and achieve your financial goals
              with our easy-to-use platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
