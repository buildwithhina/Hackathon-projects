"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authDestination } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/client";
import { EventShell } from "@/app/components/EventShell";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const query = useSearchParams();
  const next = authDestination(query.get("next"));
  const signup = mode === "signup";
  const [message, setMessage] = useState(query.get("error") === "auth" ? "Sign-in couldn’t finish. Please try again." : "");
  const [busy, setBusy] = useState(false);

  function callback() {
    const url = new URL("/auth/callback", window.location.origin);
    url.searchParams.set("next", next);
    return url.toString();
  }

  function goToEvent() {
    router.replace(next);
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const { auth } = createClient();
    setMessage("");
    setBusy(true);
    try {
      if (signup) {
        const { data, error } = await auth.signUp({
          email, password,
          options: { data: { full_name: form.get("fullName") }, emailRedirectTo: callback() },
        });
        if (error) throw error;
        if (data.session) goToEvent();
        else setMessage("Check your email to verify your account and continue.");
      } else {
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) throw error;
        goToEvent();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn’t sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function social(provider: "google" | "linkedin_oidc") {
    setMessage("");
    setBusy(true);
    try {
      const { error } = await createClient().auth.signInWithOAuth({ provider, options: { redirectTo: callback() } });
      if (error) throw error;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn’t start sign-in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <EventShell>
      <section className="eh-panel eh-auth eh-form">
        <h1>{signup ? "Create an account" : "Sign in to EventHub"}</h1>
        <div className="eh-auth-providers">
          <button className="eh-button secondary" disabled={busy} onClick={() => social("google")}>Continue with Google</button>
          <button className="eh-button secondary" disabled={busy} onClick={() => social("linkedin_oidc")}>Continue with LinkedIn</button>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={busy}>
            {signup && <label>Full name<input name="fullName" required maxLength={100} autoComplete="name" /></label>}
            <label>Email<input name="email" required type="email" autoComplete="email" /></label>
            <label>Password<input name="password" required minLength={signup ? 8 : undefined} type="password" autoComplete={signup ? "new-password" : "current-password"} /></label>
            <button type="submit" className="eh-button">{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button>
          </fieldset>
        </form>
        {message && <p className="eh-notice" role="status">{message}</p>}
        <Link className="eh-back" href={{ pathname: signup ? "/login" : "/signup", query: { next } }}>{signup ? "Already have an account? Sign in" : "New to EventHub? Create an account"}</Link>
      </section>
    </EventShell>
  );
}
