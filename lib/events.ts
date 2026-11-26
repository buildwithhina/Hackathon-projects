import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const eventFields = "id,title,category,description,venue,starts_at,ends_at,registration_deadline,capacity,published";

export function eventDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
  }).format(new Date(value)) + " IST";
}

export const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export async function requireStudent(next = "/dashboard") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return { supabase, user };
}

export async function requireStaff(organizerOnly = false) {
  const { supabase, user } = await requireStudent();
  const { data } = await supabase.from("eventhub_staff").select("role").eq("user_id", user.id).maybeSingle();
  if (!data || (organizerOnly && data.role !== "organizer")) redirect("/dashboard");
  return { supabase, user, role: data.role as "organizer" | "volunteer" };
}
