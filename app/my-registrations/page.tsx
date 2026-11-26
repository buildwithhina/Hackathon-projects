import Link from "next/link";
import { Suspense } from "react";
import { EventShell } from "@/app/components/EventShell";
import { eventDate, requireStudent } from "@/lib/events";
import { Pass } from "@/app/my-registrations/Pass";

export default function MyRegistrations({ searchParams }: PageProps<"/my-registrations">) {
  return <Suspense fallback={<EventShell><p>Loading passes…</p></EventShell>}><Registrations searchParams={searchParams} /></Suspense>;
}

async function Registrations({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const selected = (await searchParams).registration;
  const { supabase, user } = await requireStudent("/my-registrations");
  const { data, error } = await supabase.from("registrations")
    .select("id,team_name,events(title,starts_at,venue),team_members(id,name,pass_token,checked_in_at)")
    .eq("user_id", user.id).order("created_at", { ascending: false });

  return (
    <EventShell signedIn>
      <h1>My registrations</h1>
      <p>Show each attendee’s pass at the venue or download it before you go.</p>
      {error ? <p className="eh-notice" role="alert">Passes couldn’t load. Refresh to try again.</p> :
        !data.length ? <section className="eh-panel"><h2>No registrations yet</h2><Link className="eh-button" href="/dashboard">Explore events</Link></section> :
        [...data].sort((a, b) => Number(b.id === selected) - Number(a.id === selected)).map(registration => {
          const event = (registration.events as unknown) as { title: string; starts_at: string; venue: string } | null;
          return (
            <section className="eh-panel eh-registration" key={registration.id}>
              <p className="eh-category">{registration.team_name}</p><h2>{event?.title ?? "Event registration"}</h2>
              {event && <p>{eventDate(event.starts_at)} · {event.venue}</p>}
              <div className="eh-grid">
                {registration.team_members.map(member => <Pass key={member.id} token={member.pass_token} name={member.name} checkedIn={Boolean(member.checked_in_at)} />)}
              </div>
            </section>
          );
        })}
    </EventShell>
  );
}
