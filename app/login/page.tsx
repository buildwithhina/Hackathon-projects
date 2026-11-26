import { Suspense } from "react";
import AuthPage from "@/app/components/AuthPage";

export default function LoginPage() {
  return <Suspense fallback={<p>Loading sign-in…</p>}><AuthPage mode="login" /></Suspense>;
}
