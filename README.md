# EventHub

EventHub lets students discover campus events, register their teams and recover individual QR passes. Staff use the venue scanner to confirm attendance.

## Local setup

1. Install dependencies with `npm ci`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
3. In your Supabase project’s SQL Editor, run [the EventHub migration](supabase/migrations/20261126000000_event_flow.sql) once. It creates the event, registration, pass and staff tables, and imports the original demo event schedule.
4. In Supabase Authentication settings, configure Google if you use Google sign-in. Add `http://localhost:3000/auth/callback` and your deployed callback URL to the redirect allow list. Match the host and port you actually use. The app preserves the selected event through sign-in and signup.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

## Organizer and volunteer access

Create and verify each staff member’s account first. In the Supabase SQL Editor, replace the sample UUIDs with the corresponding user IDs from Authentication → Users.

```sql
insert into public.eventhub_staff (user_id, role)
values
  ('00000000-0000-0000-0000-000000000001', 'organizer'),
  ('00000000-0000-0000-0000-000000000002', 'volunteer')
on conflict (user_id) do update set role = excluded.role;
```

Organizers can create and publish events, set attendee capacity and deadlines, and see the attendance list. Organizers and volunteers can check in passes. Schedule inputs and display use IST. The camera requires HTTPS or localhost and browser camera permission. A volunteer can also enter the code shown under **Manual check-in code**.

## Verify the full flow

1. Sign in as an organizer, create a future event and publish it with an open deadline.
2. In a separate browser profile, sign in as a student and register a team from the event card.
3. Reload **My registrations** and confirm that each attendee still has a QR pass.
4. Sign in as a volunteer. Select the event, scan a pass and confirm check-in. Scan the same pass again to verify the repeat message.
5. Refresh the organizer’s attendance list and check the attendee’s timestamp.

Run `npm run lint` and `npm run build` before deploying.
