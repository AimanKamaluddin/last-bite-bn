ALTER VIEW public.merchants_public SET (security_invoker = on);
ALTER VIEW public.reviews_public SET (security_invoker = on);

CREATE POLICY "Public reads approved merchants"
  ON public.merchants FOR SELECT TO anon, authenticated
  USING (approval_status = 'approved');

REVOKE SELECT ON public.merchants FROM authenticated;
GRANT SELECT (id, user_id, business_name, business_type, description, district,
              halal_status, opening_hours, image_url, rating, approval_status,
              contact_person, created_at, updated_at)
  ON public.merchants TO authenticated;
GRANT SELECT (id, business_name, business_type, description, district,
              halal_status, opening_hours, image_url, rating, approval_status,
              created_at)
  ON public.merchants TO anon;

CREATE OR REPLACE FUNCTION public.get_my_merchant()
RETURNS SETOF public.merchants
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.merchants WHERE user_id = auth.uid();
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_merchant() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_merchant() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_merchants()
RETURNS SETOF public.merchants
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.merchants
  WHERE public.has_role(auth.uid(), 'admin'::public.app_role)
  ORDER BY created_at DESC;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_list_merchants() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_merchants() TO authenticated;