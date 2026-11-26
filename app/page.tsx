import Link from "next/link";
import { EventShell } from "@/app/components/EventShell";

export default function Home() {
  return (
    <EventShell>
      <section className="eh-hero">
        <div>
          <h1>Campus events.<br />Team ready.</h1>
          <p>Find an event, register your team and bring everyone’s QR pass to the venue.</p>
          <div className="eh-hero-actions">
            <Link className="eh-button" href="/dashboard">Explore events <span aria-hidden="true">↗</span></Link>
            <Link className="eh-button secondary" href="/login">Sign in</Link>
          </div>
        </div>
        <div className="eh-orbit" aria-hidden="true"><span>✳</span></div>
      </section>
      <section className="eh-home-steps">
        <h2>Your next event, sorted</h2>
        <div className="eh-grid">
          <article className="eh-panel"><h3>Find an event</h3><p>Browse upcoming workshops, hackathons and meetups.</p></article>
          <article className="eh-panel"><h3>Bring your team</h3><p>Register your attendees together and get a pass for each person.</p></article>
          <article className="eh-panel"><h3>Check in at the venue</h3><p>Open My registrations or show a downloaded QR pass.</p></article>
        </div>
      </section>
    </EventShell>
  );
}
