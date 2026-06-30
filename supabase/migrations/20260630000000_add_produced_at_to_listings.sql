alter table public.listings
add column if not exists produced_at timestamp with time zone;

comment on column public.listings.produced_at is 'Date and time when the food item was produced.';
