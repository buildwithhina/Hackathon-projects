
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "../../lib/supabase/client";

export default function AuthPage({
  mode: initialMode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const supabase = createClient();

  const isSignup = initialMode === "signup";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
          },
        });

        if (error) throw error;

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setMessage(
            "Account created! Please check your email to verify your account."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(
    provider: "google" | "linkedin_oidc"
  ) {
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Social login failed. Please try again."
      );
      setLoading(false);
    }
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

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#07090d] p-1">

            <button
              type="button"
              onClick={() => router.push("/login")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                !isSignup
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-400"
              }`}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                isSignup
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-400"
              }`}
            >
              Sign up
            </button>

          </div>

          {/* Social Login */}

          <div className="mt-7 space-y-3">

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("google")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#07090d] py-3 font-semibold hover:border-cyan-300 disabled:opacity-50"
            >
              <span className="text-xl font-bold">G</span>
              Continue with Google
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin("linkedin_oidc")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#07090d] py-3 font-semibold hover:border-cyan-300 disabled:opacity-50"
            >
              <span className="rounded-sm bg-[#0A66C2] px-1.5 py-0.5 font-bold text-white">
                in
              </span>
              Continue with LinkedIn
            </button>

          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {isSignup && (
              <label className="block text-sm font-medium text-slate-200">
                Full name
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-300"
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07090d] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-300"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Log in"}
            </button>

          </form>

          {message && (
            <p className="mt-4 break-words text-sm text-amber-300">
              {message}
            </p>
          )}

        </section>
      </div>
    </main>
  );
}
