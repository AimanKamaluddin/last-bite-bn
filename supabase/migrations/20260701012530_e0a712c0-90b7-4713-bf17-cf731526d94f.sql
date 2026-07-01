CREATE OR REPLACE FUNCTION public.update_my_merchant_profile(
  p_business_name text,
  p_business_type text,
  p_district text,
  p_description text DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_cover_image_url text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_opening_hours text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_tagline text DEFAULT NULL,
  p_instagram_url text DEFAULT NULL,
  p_website_url text DEFAULT NULL
)
RETURNS public.merchants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_merchant public.merchants;
BEGIN
  UPDATE public.merchants
  SET
    business_name = p_business_name,
    business_type = p_business_type,
    district = p_district,
    description = NULLIF(p_description, ''),
    image_url = NULLIF(p_image_url, ''),
    cover_image_url = NULLIF(p_cover_image_url, ''),
    address = NULLIF(p_address, ''),
    opening_hours = NULLIF(p_opening_hours, ''),
    phone = NULLIF(p_phone, ''),
    email = NULLIF(p_email, ''),
    tagline = NULLIF(p_tagline, ''),
    instagram_url = NULLIF(p_instagram_url, ''),
    website_url = NULLIF(p_website_url, ''),
    updated_at = now()
  WHERE user_id = auth.uid()
  RETURNING * INTO updated_merchant;

  IF updated_merchant.id IS NULL THEN
    RAISE EXCEPTION 'Merchant profile not found or you do not have permission to edit it';
  END IF;

  RETURN updated_merchant;
END;
$$;

REVOKE ALL ON FUNCTION public.update_my_merchant_profile(text, text, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_my_merchant_profile(text, text, text, text, text, text, text, text, text, text, text, text, text) TO authenticated;