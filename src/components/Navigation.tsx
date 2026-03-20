"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Update activeTab based on current pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("form");
    } else if (pathname === "/analytics") {
      setActiveTab("analytics");
    } else if (pathname === "/login") {
      setActiveTab("login");
    } else if (pathname === "/business-insights") {
      setActiveTab("insights");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    // Redirect to login page
    window.location.href = "/login";
  };

  const navItems = [
    { id: "login", label: "🔐 Login", href: "/login", showWhen: !isLoggedIn },
    {
      id: "form",
      label: "📝 Satisfaction Analysis",
      href: "/",
      showWhen: isLoggedIn,
    },
    {
      id: "analytics",
      label: "📊 Customer Analytics",
      href: "/analytics",
      showWhen: isLoggedIn,
    },
    {
      id: "insights",
      label: "🎯 Business Insights",
      href: "/business-insights",
      showWhen: isLoggedIn,
    },
  ];

  // Debug: Log current state
  console.log("isLoggedIn:", isLoggedIn);
  console.log("navItems:", navItems);

  const visibleItems = navItems.filter((item) => {
    // showWhen is already the condition, so just return it
    const shouldShow = item.showWhen;
    console.log(
      "Filtering item:",
      item.id,
      "showWhen:",
      item.showWhen,
      "isLoggedIn:",
      isLoggedIn,
      "shouldShow:",
      shouldShow,
    );
    return shouldShow;
  });

  console.log("Final visible items:", visibleItems);

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">
            Analytics Platform
          </span>
        </div>

        <nav className="flex gap-2">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                activeTab === item.id
                  ? "bg-white text-purple-600 shadow-lg transform scale-105"
                  : "text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
