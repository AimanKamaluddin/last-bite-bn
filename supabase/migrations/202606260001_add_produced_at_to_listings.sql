alter table public.listings
add column if not exists produced_at timestamp with time zone;

comment on column public.listings.produced_at is 'When the listed food was produced or prepared by the merchant.';
