"use client";

import { startTransition, useActionState, useState } from "react";
import { registerTeam } from "@/app/register/actions";

export function TeamForm({ eventId, email, name, maxMembers }: { eventId: string; email: string; name: string; maxMembers: number }) {
  const [members, setMembers] = useState([0]);
  const [nextMember, setNextMember] = useState(1);
  const [message, submit, pending] = useActionState(registerTeam.bind(null, eventId), "");
  return (
    <form className="eh-panel eh-form" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(() => submit(form)); }}>
      <h2>Register your team</h2>
      <p>Each attendee receives an individual QR pass.</p>
      <fieldset disabled={pending}>
        <label>Team name<input name="team" required maxLength={100} /></label>
        {members.map((id) => (
          <fieldset className="eh-member" key={id}>
            <legend>{id === 0 ? "Team leader" : `Attendee ${members.indexOf(id) + 1}`}</legend>
            <div className="eh-fields">
              <label>Full name<input name="name" required maxLength={100} defaultValue={id === 0 ? name : undefined} /></label>
              <label>Email<input name="email" type="email" required maxLength={254} defaultValue={id === 0 ? email : undefined} /></label>
            </div>
            {id !== 0 && <button type="button" className="eh-text-button" onClick={() => setMembers(members.filter(member => member !== id))}>Remove attendee</button>}
          </fieldset>
        ))}
        {members.length < maxMembers && <button type="button" className="eh-button secondary" onClick={() => {
          setMembers([...members, nextMember]);
          setNextMember(nextMember + 1);
        }}>+ Add attendee</button>}
        {message && <p className="eh-notice" role="alert">{message}</p>}
        <button className="eh-button" type="submit">{pending ? "Saving…" : "Register and get passes"}</button>
      </fieldset>
    </form>
  );
}
