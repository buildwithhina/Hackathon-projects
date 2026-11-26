import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/components/session";

export function EventShell({ children, staff, signedIn }: { children: ReactNode; staff?: string; signedIn?: boolean }) {
  return (
    <div className="eh-shell">
      <header className="eh-header">
        <Link href="/" className="eh-brand"><span aria-hidden="true">E</span>EventHub</Link>
        <nav aria-label="Main navigation">
          <Link href="/dashboard">Explore</Link>
          <Link href="/my-registrations">My registrations</Link>
          {staff && <Link href="/check-in">Check-in</Link>}
          {staff === "organizer" && <Link href="/organizer">Organizer</Link>}
          {(signedIn || staff) && <form action={signOut}><button className="eh-nav-button" type="submit">Sign out</button></form>}
        </nav>
      </header>
      <main className="eh-main">{children}</main>
    </div>
  );
}
