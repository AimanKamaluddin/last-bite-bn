DROP POLICY IF EXISTS "Anyone views approved merchants" ON public.merchants;
REVOKE SELECT ON public.merchants FROM anon;

DROP VIEW IF EXISTS public.merchants_public;
CREATE VIEW public.merchants_public AS
SELECT id, business_name, business_type, description, district, halal_status,
       opening_hours, image_url, rating, approval_status, created_at
FROM public.merchants
WHERE approval_status = 'approved';
GRANT SELECT ON public.merchants_public TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone views reviews" ON public.reviews;
CREATE POLICY "Authenticated views reviews"
  ON public.reviews FOR SELECT TO authenticated USING (true);

DROP VIEW IF EXISTS public.reviews_public;
CREATE VIEW public.reviews_public AS
SELECT id, merchant_id, rating, comment, created_at FROM public.reviews;
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT ON public.reviews_public TO anon, authenticated;

CREATE POLICY "Admins insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update roles"
  ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));