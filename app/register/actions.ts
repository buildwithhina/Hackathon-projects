"use server";

import { redirect } from "next/navigation";
import { requireStudent, uuid } from "@/lib/events";

export async function registerTeam(eventId: string, _: string, form: FormData) {
  const { supabase } = await requireStudent();
  if (!uuid.test(eventId)) return "Choose an event before registering.";
  const names = form.getAll("name").map(value => String(value).trim());
  const emails = form.getAll("email").map(value => String(value).trim().toLowerCase());
  const team = String(form.get("team") ?? "").trim();
  if (!team || team.length > 100 || names.length < 1 || names.length > 20 || names.length !== emails.length ||
      names.some(name => !name || name.length > 100) ||
      emails.some(email => email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return "Enter a valid team name, attendee name and email for each pass.";
  }
  if (new Set(emails).size !== emails.length) return "Use a different email address for each attendee.";
  const { data, error } = await supabase.rpc("register_event", {
    p_event: eventId, p_team: team, p_members: names.map((name, index) => ({ name, email: emails[index] })),
  });
  if (error) {
    const messages: Record<string, string> = {
      ALREADY_REGISTERED: "You already registered for this event. Your passes are in My registrations.",
      DUPLICATE_MEMBER: "An attendee with one of these email addresses is already registered for this event.",
      EVENT_FULL: "There aren’t enough seats left for this team.",
      REGISTRATION_CLOSED: "Registration for this event is closed.",
    };
    return messages[error.message] ?? "We couldn’t save your registration. Please try again.";
  }
  redirect(`/my-registrations?registration=${data}`);
}
