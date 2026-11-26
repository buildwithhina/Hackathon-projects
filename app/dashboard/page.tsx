import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { eventDate, eventFields } from "@/lib/events";
import { EventShell } from "@/app/components/EventShell";

export default function Dashboard({ searchParams }: PageProps<"/dashboard">) {
  return <Suspense fallback={<EventShell><p>Loading events…</p></EventShell>}><Events searchParams={searchParams} /></Suspense>;
}

async function Events({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const past = (await searchParams).view === "past";
  const supabase = await createClient();
  const now = new Date();
  const query = supabase.from("events").select(eventFields).eq("published", true);
  const [result, staff, auth] = await Promise.all([
    (past ? query.lt("ends_at", now.toISOString()) : query.gte("ends_at", now.toISOString()))
      .order("starts_at", { ascending: !past }),
    supabase.from("eventhub_staff").select("role").maybeSingle(),
    supabase.auth.getUser(),
  ]);

  return (
    <EventShell staff={staff.data?.role} signedIn={Boolean(auth.data.user)}>
      <section className="eh-hero">
        <div>
          <h1>Find your next<br />campus event.</h1>
          <p>Explore workshops, meetups and competitions. Bring your team and keep your passes in one place.</p>
        </div>
        <div className="eh-orbit" aria-hidden="true"><span>✳</span></div>
      </section>
      <div className="eh-section-head">
        <h2>Explore events</h2>
        <nav className="eh-tabs" aria-label="Event schedule">
          <Link href="/dashboard" aria-current={!past ? "page" : undefined}>Upcoming</Link>
          <Link href="/dashboard?view=past" aria-current={past ? "page" : undefined}>Past</Link>
        </nav>
      </div>
      {result.error ? <p className="eh-notice" role="alert">Events couldn’t load. Refresh the page to try again.</p> :
        !result.data.length ? <p className="eh-panel">No {past ? "past" : "upcoming"} events yet.</p> :
        <div className="eh-grid">
          {result.data.map((event, index) => {
            const closed = past || Date.parse(event.registration_deadline) <= now.getTime();
            return (
              <article className="eh-card" key={event.id}>
                <div className={["eh-art mint", "eh-art violet", "eh-art peach"][index % 3]} aria-hidden="true"><span>{["✳", "◈", "✴"][index % 3]}</span></div>
                <div className="eh-card-body">
                  <p className="eh-category">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="eh-meta"><time dateTime={event.starts_at}>{eventDate(event.starts_at)}</time><span>{event.venue}</span></div>
                  <Link className={closed ? "eh-button secondary" : "eh-button"} href={`/register?event=${event.id}`}>{closed ? "View details" : "Register now"} <span aria-hidden="true">↗</span></Link>
                </div>
              </article>
            );
          })}
        </div>}
    </EventShell>
  );
}
