import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const publicMerchantSchema = z.object({
  id: z.string().trim().min(1, "Merchant profile is required"),
});

export const getPublicMerchantProfile = createServerFn({ method: "POST" })
  .inputValidator((data) => publicMerchantSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: merchant, error } = await supabaseAdmin
      .from("merchants")
      .select(
        "id, business_name, business_type, district, image_url, cover_image_url, rating, description, tagline, opening_hours, address, phone, email, instagram_url, website_url, approval_status, halal_status, created_at",
      )
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!merchant) return null;

    // Approved merchants are public. Also allow a merchant with at least one live,
    // visible listing so a buyer never lands on a broken vendor page from a visible offer.
    if (merchant.approval_status !== "approved") {
      const { data: liveListing, error: listingError } = await supabaseAdmin
        .from("listings")
        .select("id")
        .eq("merchant_id", data.id)
        .eq("visible", true)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (listingError) throw new Error(listingError.message);
      if (!liveListing) return null;
    }

    return merchant;
  });