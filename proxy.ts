import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies, headers) {
          for (const { name, value } of cookies) request.cookies.set(name, value);
          const updated = NextResponse.next({ request });
          for (const cookie of response.cookies.getAll()) updated.cookies.set(cookie);
          for (const { name, value, options } of cookies) updated.cookies.set(name, value, options);
          for (const [name, value] of Object.entries(headers)) updated.headers.set(name, value);
          response = updated;
        },
      },
    },
  );
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/dashboard", "/register", "/my-registrations", "/check-in", "/organizer"],
};
