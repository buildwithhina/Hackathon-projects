"use client";

import Link from "next/link";
import { useState } from "react";

export default function AuthPage({
  mode: initialMode,
}: {
  mode: "login" | "signup";
}) {
  const [mode, setMode] = useState(initialMode);
  const isSignup = mode === "signup";
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Demo only — account authentication is not connected yet.");
  }

  return (
    <main className="min-h-screen bg-[#07090d] px-6 py-12 text-white">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-xl font-bold">
          Event<span className="text-cyan-300">Hub</span>
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#0c1017] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {isSignup ? "Join EventHub" : "Welcome back"}
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            {isSignup ? "Create an account" : "Log in"}
          </h1>
          <p className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#07090d] p-1">
  <button
    type="button"
    onClick={() => {
      setMode("login");
      setMessage("");
    }}
    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
      !isSignup ? "bg-cyan-300 text-slate-950" : "text-slate-400"
    }`}
  >
    Log in
  </button>

  <button
    type="button"
    onClick={() => {
      setMode("signup");
      setMessage("");
    }}
    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
      isSignup ? "bg-cyan-300 text-slate-950" : "text-slate-400"
    }`}
  >
    Sign up
  </button>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <label className="block text-sm font-medium text-slate-200">
                Full name
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-300"
                />
              </label>
            )}

            <label className="block text-sm font-medium text-slate-200">
              Email address
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-300"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                required
                type="password"
                minLength={8}
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-300"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200"
            >
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-amber-300">{message}</p>
          )}
        </section>
      </div>
    </main>
  );
}