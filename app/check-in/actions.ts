"use server";

import { requireStaff, uuid } from "@/lib/events";

export type ScanResult = { status: "checked_in" | "repeat" | "invalid" | "error"; attendee?: string; team?: string; scanned_at?: string };

export async function scanPass(eventId: string, code: string): Promise<ScanResult> {
  const { supabase } = await requireStaff();
  const token = code.trim().replace(/^eventhub:/i, "");
  if (!uuid.test(eventId) || !uuid.test(token)) return { status: "invalid" };
  const { data, error } = await supabase.rpc("check_in_pass", { p_event: eventId, p_token: token });
  return error || !data?.[0] ? { status: "error" } : data[0];
}
