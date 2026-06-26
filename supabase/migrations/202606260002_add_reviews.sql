create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone not null default now(),
  unique(order_id)
);

alter table public.reviews enable row level security;

drop policy if exists "Users can read reviews" on public.reviews;
create policy "Users can read reviews"
on public.reviews for select
using (true);

drop policy if exists "Customers can create reviews for their collected orders" on public.reviews;
create policy "Customers can create reviews for their collected orders"
on public.reviews for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
      and o.status = 'collected'
  )
);

drop policy if exists "Customers can update their own reviews" on public.reviews;
create policy "Customers can update their own reviews"
on public.reviews for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
