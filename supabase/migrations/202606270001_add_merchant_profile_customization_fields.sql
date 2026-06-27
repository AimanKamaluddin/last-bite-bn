alter table public.merchants
add column if not exists tagline text,
add column if not exists cover_image_url text,
add column if not exists instagram_url text,
add column if not exists website_url text;

create or replace view public.merchants_public as
select
  id,
  business_name,
  business_type,
  district,
  image_url,
  rating,
  description,
  opening_hours,
  address,
  phone,
  email,
  tagline,
  cover_image_url,
  instagram_url,
  website_url,
  approval_status,
  created_at,
  updated_at
from public.merchants
where approval_status = 'approved';
