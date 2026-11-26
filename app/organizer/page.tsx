import Link from "next/link";
import { Suspense } from "react";
import { EventShell } from "@/app/components/EventShell";
import { eventDate, eventFields, requireStaff, uuid } from "@/lib/events";
import { EventForm } from "@/app/organizer/EventForm";

export default function OrganizerPage({ searchParams }: PageProps<"/organizer">) {
  return <Suspense fallback={<EventShell><p>Loading organizer tools…</p></EventShell>}><Organizer searchParams={searchParams} /></Suspense>;
}

async function Organizer({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { supabase } = await requireStaff(true);
  const { event: id, page } = await searchParams;
  const pageNumber = typeof page === "string" && /^\d{1,6}$/.test(page) ? Math.max(1, Number(page)) : 1;
  const [events, attendance] = await Promise.all([
    supabase.from("events").select(eventFields).order("starts_at", { ascending: false }),
    typeof id === "string" && uuid.test(id) ? supabase.from("team_members")
      .select("id,name,email,checked_in_at,registrations(team_name)", { count: "exact" })
      .eq("event_id", id).order("name").order("id").range((pageNumber - 1) * 50, pageNumber * 50 - 1) : null,
  ]);
  const selected = events.data?.find(event => event.id === id);
  return (
    <EventShell staff="organizer">
      <h1>Manage events</h1>
      <p>Publish events, set registration limits and review attendance.</p>
      <div className="eh-panel">
        <div className="eh-section-head"><h2>Your event schedule</h2><Link className="eh-button secondary" href="/organizer">New event</Link></div>
        {events.error ? <p role="alert">Events couldn’t load.</p> : <div className="eh-event-list">
          {events.data.map(event => <Link aria-current={selected?.id === event.id ? "page" : undefined} key={event.id} href={`/organizer?event=${event.id}`}>
            <strong>{event.title}</strong><span>{eventDate(event.starts_at)} · {event.published ? "Published" : "Draft"}</span>
          </Link>)}
        </div>}
      </div>
      <section className="eh-panel"><h2>{selected ? "Edit event" : "Create an event"}</h2><EventForm key={selected ? JSON.stringify(selected) : "new"} event={selected} /></section>
      {selected && attendance && <section className="eh-panel">
        <h2>Attendance</h2>
        {attendance.error ? <p role="alert">Attendance couldn’t load.</p> : <>
          <p>{attendance.count ?? 0} registered attendees</p>
          {!!attendance.data.length && <div className="eh-table"><table>
            <thead><tr><th>Attendee</th><th>Team</th><th>Check-in time</th></tr></thead>
            <tbody>{attendance.data.map(member => {
              const registration = member.registrations as unknown as { team_name: string } | null;
              return <tr key={member.id}><td>{member.name}<small>{member.email}</small></td><td>{registration?.team_name}</td><td>{member.checked_in_at ? eventDate(member.checked_in_at) : "Pending"}</td></tr>;
            })}</tbody>
          </table></div>}
          <div className="eh-pagination">
            {pageNumber > 1 && <Link href={`/organizer?event=${selected.id}&page=${pageNumber - 1}`}>← Previous</Link>}
            {pageNumber * 50 < (attendance.count ?? 0) && <Link href={`/organizer?event=${selected.id}&page=${pageNumber + 1}`}>Next →</Link>}
          </div>
        </>}
      </section>}
    </EventShell>
  );
}
