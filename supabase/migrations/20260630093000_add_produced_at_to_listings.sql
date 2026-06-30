alter table public.listings
add column if not exists produced_at timestamptz;

comment on column public.listings.produced_at is 'Date and time the food was produced, entered by the merchant when creating a listing.';
