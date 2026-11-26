import { authDestination } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = authDestination(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return new Response(null, { status: 307, headers: { Location: next } });
  }

  const loginQuery = new URLSearchParams({ error: "auth", next });
  return new Response(null, { status: 307, headers: { Location: `/login?${loginQuery}` } });
}
