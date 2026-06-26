import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  DISTRICTS,
  type SampleListing,
} from "@/lib/sample-data";
import { ListingCard } from "@/components/listings/ListingCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse surplus food in Brunei — Last Bite" },
      { name: "description", content: "Discover discounted surplus food from Brunei merchants. Filter by district and category." },
    ],
  }),
  component: Browse,
});

type Row = SampleListing & { _isLive?: boolean };

function Browse() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  
  const [live, setLive] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("listings")
        .select("*, merchants_public!inner(business_name, district, rating)")
        .eq("visible", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (data && data.length) {
        setLive(
          data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            description: d.description ?? "",
            original_price: Number(d.original_price),
            discounted_price: Number(d.discounted_price),
            quantity_available: d.quantity_available,
            pickup_start: d.pickup_start,
            pickup_end: d.pickup_end,
            image_url:
              d.image_url ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70",
            allergen_info: d.allergen_info ?? "",
            merchant: {
              id: d.merchant_id,
              business_name: d.merchants_public?.business_name ?? "",
              business_type: "",
              district: d.merchants_public?.district ?? "",
              rating: Number(d.merchants_public?.rating ?? 0),
              image_url: "",
            },
            _isLive: true,
          })),
        );
      }
      setLoading(false);
    })();
  }, []);

  const all: Row[] = live;

  const filtered = useMemo(() => {
    return all.filter((l) => {
      if (q && !`${l.title} ${l.merchant.business_name}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (district && l.merchant.district !== district) return false;
      if (category && l.category !== category) return false;
      return true;
    });
  }, [all, q, district, category]);

  return (
    <SiteLayout>
      <section className="container mx-auto px-3 py-6 sm:px-4 sm:py-10">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">Browse surplus food</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {loading ? "Loading available food…" : `${filtered.length} offers available.`}
        </p>

        <div className="sticky top-14 z-30 -mx-3 mt-5 border-y bg-background/95 px-3 py-3 shadow-sm backdrop-blur sm:static sm:mx-0 sm:mt-6 sm:rounded-3xl sm:border sm:bg-card sm:p-4 sm:shadow-sm">
          <div className="relative mb-3 sm:mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search meals or merchants…"
              className="h-11 rounded-full pl-9 text-base"
            />
          </div>

          <FilterRow label="District" value={district} onChange={setDistrict} options={DISTRICTS as readonly string[]} />
          <FilterRow label="Category" value={category} onChange={setCategory} options={CATEGORIES as readonly string[]} />
        </div>

        {filtered.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <AdSlot size="leaderboard" id="ad-space-04-browse-top" slotCode="AD SPACE 04" label="AD SPACE 04 browse top" />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mx-auto mt-10 max-w-md rounded-3xl border bg-card p-6 text-center sm:mt-16 sm:p-10">
            <div className="text-lg font-semibold">No food matches your filters</div>
            <p className="mt-2 text-sm text-muted-foreground">Try clearing a filter or check back later — new offers can appear throughout the day.</p>
            <Button className="mt-4 rounded-full" onClick={() => { setQ(""); setDistrict(""); setCategory(""); }}>Clear filters</Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <Fragment key={l.id}>
                <ListingCard listing={l} />
                {(i + 1) === 6 && i !== filtered.length - 1 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdSlot size="billboard" id="ad-space-05-browse-billboard" slotCode="AD SPACE 05" label="AD SPACE 05 browse billboard" />
                  </div>
                )}
                {(i + 1) === 15 && i !== filtered.length - 1 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdSlot size="leaderboard" id="ad-space-06-browse-lower" slotCode="AD SPACE 06" label="AD SPACE 06 browse lower" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function FilterRow({
  label,
  value,
  onChange,
  options,
  labelFor,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  labelFor?: (v: string) => string;
}) {
  return (
    <div className="mb-2 sm:mb-3">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
        <Chip active={value === ""} onClick={() => onChange("")}>All</Chip>
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(o)}>
            {labelFor ? labelFor(o) : o}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} type="button" className="shrink-0">
      <Badge
        variant={active ? "default" : "secondary"}
        className="cursor-pointer rounded-full px-3 py-1.5 text-xs"
      >
        {children}
      </Badge>
    </button>
  );
}
