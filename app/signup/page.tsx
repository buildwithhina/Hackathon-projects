import { Suspense } from "react";
import AuthPage from "@/app/components/AuthPage";

export default function SignupPage() {
  return <Suspense fallback={<p>Loading signup…</p>}><AuthPage mode="signup" /></Suspense>;
}
