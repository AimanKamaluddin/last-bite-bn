-- Fix: public pages should read safe merchant data from merchants_public,
-- not require direct permissions on the private merchants table.
--
-- This view intentionally exposes only marketplace-safe merchant fields.
-- Private fields such as email, phone, address, business_reg_no,
-- contact_person and user_id stay on public.merchants.

create or replace view public.merchants_public
with (security_invoker = false)
as
select
  id,
  business_name,
  business_type,
  district,
  description,
  halal_status,
  image_url,
  opening_hours,
  rating,
  approval_status,
  created_at
from public.merchants
where approval_status = 'approved';

grant select on public.merchants_public to anon, authenticated;

-- Keep public reviews safe too, because merchant profile pages often read
-- review summaries without exposing reviewer user IDs or order IDs.
create or replace view public.reviews_public
with (security_invoker = false)
as
select
  id,
  merchant_id,
  rating,
  comment,
  created_at
from public.reviews;

grant select on public.reviews_public to anon, authenticated;
