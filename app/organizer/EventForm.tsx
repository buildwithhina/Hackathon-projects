"use client";

import { startTransition, useActionState } from "react";
import { saveEvent } from "@/app/organizer/actions";

type Event = {
  id: string; title: string; category: string; description: string; venue: string;
  starts_at: string; ends_at: string; registration_deadline: string; capacity: number; published: boolean;
};

function localTime(value?: string) {
  if (!value) return undefined;
  return new Date(Date.parse(value) + 330 * 60 * 1000).toISOString().slice(0, 16);
}

export function EventForm({ event }: { event?: Event }) {
  const [message, action, pending] = useActionState(saveEvent.bind(null, event?.id ?? null), "");
  return (
    <form className="eh-form" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(() => action(form)); }}>
      <fieldset disabled={pending}>
        <div className="eh-fields">
          <label>Event name<input name="title" required maxLength={120} defaultValue={event?.title} /></label>
          <label>Category<input name="category" required maxLength={60} defaultValue={event?.category} /></label>
          <label>Venue<input name="venue" required maxLength={160} defaultValue={event?.venue} /></label>
          <label>Attendee capacity<input name="capacity" type="number" min={1} max={2147483647} required defaultValue={event?.capacity} /></label>
          <label>Starts (IST)<input name="starts" type="datetime-local" required defaultValue={localTime(event?.starts_at)} /></label>
          <label>Ends (IST)<input name="ends" type="datetime-local" required defaultValue={localTime(event?.ends_at)} /></label>
          <label>Registration deadline (IST)<input name="deadline" type="datetime-local" required defaultValue={localTime(event?.registration_deadline)} /></label>
        </div>
        <label>Description<textarea name="description" required rows={3} maxLength={2000} defaultValue={event?.description} /></label>
        <label className="eh-check"><input type="checkbox" name="published" defaultChecked={event?.published} /> Published on the event dashboard</label>
        {message && <p className={`eh-notice ${message === "Event saved." ? "success" : ""}`} role="status">{message}</p>}
        <button type="submit" className="eh-button">{pending ? "Saving…" : event ? "Save changes" : "Create event"}</button>
      </fieldset>
    </form>
  );
}
