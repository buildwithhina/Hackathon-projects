import Link from "next/link";
import { Suspense } from "react";
import { EventShell } from "@/app/components/EventShell";
import { eventDate, eventFields, uuid } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "@/app/register/TeamForm";

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return <Suspense fallback={<EventShell><p>Loading event…</p></EventShell>}><Registration searchParams={searchParams} /></Suspense>;
}

async function Registration({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { event: id } = await searchParams;
  if (typeof id !== "string" || !uuid.test(id)) return <EventShell><h1>Choose an event</h1><Link className="eh-button" href="/dashboard">Explore events</Link></EventShell>;
  const supabase = await createClient();
  const [event, auth, seats] = await Promise.all([
    supabase.from("events").select(eventFields).eq("id", id).eq("published", true).maybeSingle(),
    supabase.auth.getUser(), supabase.rpc("event_seats", { p_event: id }),
  ]);
  if (!event.data) return <EventShell><h1>{event.error ? "Couldn’t load this event" : "Event unavailable"}</h1><Link href="/dashboard">Back to events</Link></EventShell>;
  const info = event.data;
  const user = auth.data.user;
  const registration = user ? await supabase.from("registrations").select("id").eq("event_id", id).eq("user_id", user.id).maybeSingle() : null;
  const closed = Date.parse(info.registration_deadline) <= new Date().getTime();
  return (
    <EventShell>
      <Link className="eh-back" href="/dashboard">← Explore events</Link>
      <div className="eh-split">
        <section className="eh-panel eh-event-info">
          <p className="eh-category">{info.category}</p><h1>{info.title}</h1><p>{info.description}</p>
          <dl><dt>Starts</dt><dd>{eventDate(info.starts_at)}</dd><dt>Ends</dt><dd>{eventDate(info.ends_at)}</dd><dt>Venue</dt><dd>{info.venue}</dd><dt>Registration deadline</dt><dd>{eventDate(info.registration_deadline)}</dd>
          {typeof seats.data === "number" && !closed && <><dt>Available seats</dt><dd>{seats.data}</dd></>}</dl>
        </section>
        {registration?.data ? <section className="eh-panel"><h2>You’re registered</h2><Link className="eh-button" href={`/my-registrations?registration=${registration.data.id}`}>View passes</Link></section> :
          closed || seats.data === 0 ? <section className="eh-panel"><h2>{closed ? "Registration is closed" : "This event is full"}</h2></section> :
          user ? <TeamForm eventId={id} email={user.email ?? ""} name={typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : ""} maxMembers={Math.min(20, seats.data ?? 20)} /> :
            <section className="eh-panel"><h2>Sign in to register</h2><p>Use your EventHub account to register and recover your passes later.</p><Link className="eh-button" href={`/login?next=${encodeURIComponent(`/register?event=${id}`)}`}>Sign in</Link></section>}
      </div>
    </EventShell>
  );
}
