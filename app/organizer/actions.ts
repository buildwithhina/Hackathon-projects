"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff, uuid } from "@/lib/events";

export async function saveEvent(id: string | null, _: string, form: FormData) {
  const { supabase } = await requireStaff(true);
  const read = (key: string) => String(form.get(key) ?? "").trim();
  function date(key: string) {
    const value = read(key);
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? Date.parse(value + ":00+05:30") : NaN;
  }
  const starts = date("starts");
  const ends = date("ends");
  const deadline = date("deadline");
  const capacity = Number(read("capacity"));
  if (![starts, ends, deadline].every(Number.isFinite) || ends <= starts || deadline > starts) {
    return "Set an end time after the start and a registration deadline at or before the start.";
  }
  if (!Number.isSafeInteger(capacity) || capacity < 1 || capacity > 2147483647) return "Enter a valid attendee capacity.";
  if (id && !uuid.test(id)) return "Choose an existing event.";
  const title = read("title"), category = read("category"), description = read("description"), venue = read("venue");
  if (!title || !category || !description || !venue) return "Complete all event details before saving.";
  const event = {
    title, category, description, venue, capacity,
    starts_at: new Date(starts).toISOString(), ends_at: new Date(ends).toISOString(),
    registration_deadline: new Date(deadline).toISOString(), published: read("published") === "on",
  };
  const query = id ? supabase.from("events").update(event).eq("id", id) : supabase.from("events").insert(event);
  const { data, error } = await query.select("id").single();
  if (error?.message === "CAPACITY_BELOW_BOOKINGS") return "Capacity can’t be lower than the current number of booked seats.";
  if (error) return "Couldn’t save this event. Check its details and try again.";
  revalidatePath("/organizer");
  revalidatePath("/dashboard");
  revalidatePath("/register");
  if (!id) redirect(`/organizer?event=${data.id}`);
  return "Event saved.";
}
