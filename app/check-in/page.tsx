import { Suspense } from "react";
import { EventShell } from "@/app/components/EventShell";
import { requireStaff } from "@/lib/events";
import { Scanner } from "@/app/check-in/Scanner";

export default function CheckIn() {
  return <Suspense fallback={<EventShell><p>Loading scanner…</p></EventShell>}><CheckInContent /></Suspense>;
}

async function CheckInContent() {
  const { supabase, role } = await requireStaff();
  const { data, error } = await supabase.from("events").select("id,title").eq("published", true).order("starts_at", { ascending: false });
  return (
    <EventShell staff={role}>
      <h1>Venue check-in</h1>
      <p>Select the event, scan a QR pass and confirm the attendee’s check-in.</p>
      {error ? <p className="eh-notice" role="alert">Events couldn’t load. Refresh to try again.</p> : <Scanner events={data} />}
    </EventShell>
  );
}
