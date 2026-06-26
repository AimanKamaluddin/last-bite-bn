create or replace function public.save_vendor_profile(p_profile jsonb)
returns setof public.merchants
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.merchants
  set
    business_name = coalesce(p_profile->>'business_name', business_name),
    tagline = p_profile->>'tagline',
    business_type = p_profile->>'business_type',
    district = p_profile->>'district',
    description = p_profile->>'description',
    image_url = p_profile->>'image_url',
    cover_image_url = p_profile->>'cover_image_url',
    address = p_profile->>'address',
    opening_hours = p_profile->>'opening_hours',
    phone = p_profile->>'phone',
    email = p_profile->>'email',
    instagram_url = p_profile->>'instagram_url',
    website_url = p_profile->>'website_url'
  where user_id = auth.uid()
  returning *;
end;
$$;

grant execute on function public.save_vendor_profile(jsonb) to authenticated;

notify pgrst, 'reload schema';
