create or replace function public.update_my_merchant_profile_json(profile jsonb)
returns setof public.merchants
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.merchants
  set
    business_name = coalesce(profile->>'business_name', business_name),
    tagline = profile->>'tagline',
    business_type = profile->>'business_type',
    district = profile->>'district',
    description = profile->>'description',
    image_url = profile->>'image_url',
    cover_image_url = profile->>'cover_image_url',
    address = profile->>'address',
    opening_hours = profile->>'opening_hours',
    phone = profile->>'phone',
    email = profile->>'email',
    instagram_url = profile->>'instagram_url',
    website_url = profile->>'website_url'
  where user_id = auth.uid()
  returning *;
end;
$$;

grant execute on function public.update_my_merchant_profile_json(jsonb) to authenticated;

notify pgrst, 'reload schema';
