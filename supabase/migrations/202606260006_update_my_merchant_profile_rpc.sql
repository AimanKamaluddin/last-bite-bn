create or replace function public.update_my_merchant_profile(
  p_business_name text,
  p_tagline text default null,
  p_business_type text default null,
  p_district text default null,
  p_description text default null,
  p_image_url text default null,
  p_cover_image_url text default null,
  p_address text default null,
  p_opening_hours text default null,
  p_phone text default null,
  p_email text default null,
  p_instagram_url text default null,
  p_website_url text default null
)
returns setof public.merchants
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.merchants
  set
    business_name = p_business_name,
    tagline = p_tagline,
    business_type = p_business_type,
    district = p_district,
    description = p_description,
    image_url = p_image_url,
    cover_image_url = p_cover_image_url,
    address = p_address,
    opening_hours = p_opening_hours,
    phone = p_phone,
    email = p_email,
    instagram_url = p_instagram_url,
    website_url = p_website_url
  where user_id = auth.uid()
  returning *;
end;
$$;

grant execute on function public.update_my_merchant_profile(text, text, text, text, text, text, text, text, text, text, text, text, text) to authenticated;
