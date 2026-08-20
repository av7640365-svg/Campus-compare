"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
        setLoading(false);
        return;
      }

      setMessage("Login successful!");

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(new Event("authChanged"));

      setTimeout(() => {
        router.push("/");
      }, 800);

      console.log("Logged in user:", data.user);
    } catch (error) {
      console.error(error);
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome Back
        </h1>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600 sm:text-base">
          Login to access your saved colleges and comparisons.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 sm:mt-8"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-800">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:text-base"
            />
          </div>

          {/* Message */}
          {message && (
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-700 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}