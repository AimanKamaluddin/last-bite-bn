alter table public.merchants enable row level security;

drop policy if exists "Merchants can update their own profile" on public.merchants;
create policy "Merchants can update their own profile"
on public.merchants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Merchants can read their own profile" on public.merchants;
create policy "Merchants can read their own profile"
on public.merchants
for select
to authenticated
using (auth.uid() = user_id);
