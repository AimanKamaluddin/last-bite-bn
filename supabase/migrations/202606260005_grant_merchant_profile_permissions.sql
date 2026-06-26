grant usage on schema public to authenticated;
grant select, insert, update on table public.merchants to authenticated;

alter table public.merchants enable row level security;

drop policy if exists "Merchants can read their own profile" on public.merchants;
create policy "Merchants can read their own profile"
on public.merchants
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Merchants can update their own profile" on public.merchants;
create policy "Merchants can update their own profile"
on public.merchants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can submit merchant applications" on public.merchants;
create policy "Users can submit merchant applications"
on public.merchants
for insert
to authenticated
with check (auth.uid() = user_id);
