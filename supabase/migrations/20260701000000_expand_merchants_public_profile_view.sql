-- Expose the full set of public vendor profile fields used by /merchant-profile/:id.
-- Without these columns, profile edits can save to public.merchants but still appear
-- unchanged on the public-facing vendor page because merchants_public hides them.

CREATE OR REPLACE VIEW public.merchants_public AS
SELECT
  id,
  business_name,
  business_type,
  district,
  image_url,
  cover_image_url,
  rating,
  description,
  tagline,
  opening_hours,
  address,
  phone,
  email,
  instagram_url,
  website_url,
  approval_status,
  halal_status,
  created_at
FROM public.merchants
WHERE approval_status = 'approved';

GRANT SELECT ON public.merchants_public TO anon;
GRANT SELECT ON public.merchants_public TO authenticated;
