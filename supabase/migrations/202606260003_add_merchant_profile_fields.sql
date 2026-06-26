alter table public.merchants
add column if not exists tagline text,
add column if not exists cover_image_url text,
add column if not exists instagram_url text,
add column if not exists website_url text;

comment on column public.merchants.tagline is 'Short public-facing tagline for the merchant profile.';
comment on column public.merchants.cover_image_url is 'Cover image shown on the public merchant profile.';
comment on column public.merchants.instagram_url is 'Public Instagram or social media link.';
comment on column public.merchants.website_url is 'Public website or menu link.';
