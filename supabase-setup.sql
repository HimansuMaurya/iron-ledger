create table if not exists public.user_snapshots (
  user_id uuid primary key references auth.users on delete cascade,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.user_snapshots enable row level security;

create or replace function public.touch_user_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists user_snapshots_touch_updated_at on public.user_snapshots;
create trigger user_snapshots_touch_updated_at
before update on public.user_snapshots
for each row
execute function public.touch_user_snapshots_updated_at();

drop policy if exists "Users can view their own snapshot" on public.user_snapshots;
create policy "Users can view their own snapshot"
on public.user_snapshots
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can insert their own snapshot" on public.user_snapshots;
create policy "Users can insert their own snapshot"
on public.user_snapshots
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Users can update their own snapshot" on public.user_snapshots;
create policy "Users can update their own snapshot"
on public.user_snapshots
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);
