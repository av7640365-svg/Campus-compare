"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    updateUser();

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));

    window.location.href = "/";
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-lg font-bold text-gray-900 sm:text-xl"
        >
          Campus<span className="text-blue-600">Compare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          <Link
            href="/colleges"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Explore Colleges
          </Link>

          <Link
            href="/compare"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Compare
          </Link>

          {user && (
            <>
              <Link
                href="/saved"
                className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Saved Colleges
              </Link>

              <Link
                href="/saved-comparisons"
                className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                Saved Comparisons
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="max-w-32 truncate text-sm font-medium text-gray-700">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <span className="text-2xl leading-none">✕</span>
          ) : (
            <span className="text-2xl leading-none">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <Link
              href="/colleges"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Explore Colleges
            </Link>

            <Link
              href="/compare"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Compare Colleges
            </Link>

            {user && (
              <>
                <Link
                  href="/saved"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Saved Colleges
                </Link>

                <Link
                  href="/saved-comparisons"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Saved Comparisons
                </Link>
              </>
            )}

            <div className="mt-3 border-t border-gray-200 pt-4">
              {user ? (
                <>
                  <p className="mb-3 px-3 text-sm font-medium text-gray-700">
                    Hi, {user.name}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}