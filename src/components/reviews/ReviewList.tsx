import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ReviewList({ listingId, merchantId }: { listingId?: string; merchantId?: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let query = (supabase as any).from("reviews").select("id, rating, comment, created_at").order("created_at", { ascending: false }).limit(8);
      if (listingId) query = query.eq("listing_id", listingId);
      if (merchantId) query = query.eq("merchant_id", merchantId);
      const { data } = await query;
      if (!cancelled) {
        setReviews(data ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listingId, merchantId]);

  if (loading) return <Card className="mt-3 rounded-2xl p-4 text-sm text-muted-foreground">Loading reviews…</Card>;
  if (reviews.length === 0) return <Card className="mt-3 rounded-2xl p-4 text-sm text-muted-foreground">No customer reviews yet.</Card>;

  const avg = reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length;

  return (
    <Card className="mt-3 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Customer reviews</h3>
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 fill-sun text-sun" /> {avg.toFixed(1)} / 5
        </div>
      </div>
      <div className="mt-4 grid gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border bg-background/60 p-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-sun text-sun" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
}
