
-- Add admin role
alter table public.eventhub_staff
drop constraint if exists eventhub_staff_role_check;

alter table public.eventhub_staff
add constraint eventhub_staff_role_check
check (role in ('admin', 'organizer', 'volunteer'));

-- Admin can read all events
create policy admin_events_read
on public.events
for select
to authenticated
using (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- Admin can create events
create policy admin_events_insert
on public.events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- Admin can update events
create policy admin_events_update
on public.events
for update
to authenticated
using (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- Admin can delete events
grant delete on public.events to authenticated;

create policy admin_events_delete
on public.events
for delete
to authenticated
using (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- Admin can view all registrations
create policy admin_registrations_read
on public.registrations
for select
to authenticated
using (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- Admin can view all team members and attendance
create policy admin_members_read
on public.team_members
for select
to authenticated
using (
  exists (
    select 1
    from public.eventhub_staff
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);
