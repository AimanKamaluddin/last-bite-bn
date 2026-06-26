alter table public.orders
add column if not exists pickup_time text;
