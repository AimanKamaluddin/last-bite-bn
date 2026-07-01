import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const optionalText = z.string().trim().optional().nullable();

const merchantProfileSchema = z.object({
  merchant_id: z.string().trim().min(1, "Merchant profile is required"),
  business_name: z.string().trim().min(1, "Business name is required"),
  business_type: z.string().trim().min(1, "Business type is required"),
  district: z.string().trim().min(1, "District is required"),
  description: optionalText,
  image_url: optionalText,
  cover_image_url: optionalText,
  address: optionalText,
  opening_hours: optionalText,
  phone: optionalText,
  email: optionalText,
  tagline: optionalText,
  instagram_url: optionalText,
  website_url: optionalText,
});

const clean = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const updateMyMerchantProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => merchantProfileSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      business_name: data.business_name,
      business_type: data.business_type,
      district: data.district,
      description: clean(data.description),
      image_url: clean(data.image_url),
      cover_image_url: clean(data.cover_image_url),
      address: clean(data.address),
      opening_hours: clean(data.opening_hours),
      phone: clean(data.phone),
      email: clean(data.email),
      tagline: clean(data.tagline),
      instagram_url: clean(data.instagram_url),
      website_url: clean(data.website_url),
      updated_at: new Date().toISOString(),
    };

    const { data: merchant, error } = await supabaseAdmin
      .from("merchants")
      .update(payload)
      .eq("id", data.merchant_id)
      .eq("user_id", context.userId)
      .select("*")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!merchant) throw new Error("Merchant profile not found or you do not have permission to edit it.");

    return merchant;
  });