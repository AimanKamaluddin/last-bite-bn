import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  DISTRICTS,
  HALAL_STATUSES,
  sampleListings,
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
      { name: "description", content: "Discover discounted surplus food from Brunei merchants. Filter by district, category and halal status." },
    ],
  }),
  component: Browse,
});

type Row = SampleListing & { _isLive?: boolean };

function Browse() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [halal, setHalal] = useState<string>("");
  const [live, setLive] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("*, merchants!inner(business_name, district, rating, halal_status, approval_status)")
        .eq("visible", true)
        .eq("status", "active")
        .eq("merchants.approval_status", "approved")
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
            halal_info: d.halal_info ?? "",
            merchant: {
              id: d.merchant_id,
              business_name: d.merchants.business_name,
              business_type: "",
              district: d.merchants.district,
              halal_status: d.merchants.halal_status,
              rating: Number(d.merchants.rating ?? 0),
              image_url: "",
            },
            _isLive: true,
          })),
        );
      }
      setLoading(false);
    })();
  }, []);

  const all: Row[] = live.length ? live : sampleListings.map((l) => ({ ...l }));

  const filtered = useMemo(() => {
    return all.filter((l) => {
      if (q && !`${l.title} ${l.merchant.business_name}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (district && l.merchant.district !== district) return false;
      if (category && l.category !== category) return false;
      if (halal && l.merchant.halal_status !== halal) return false;
      return true;
    });
  }, [all, q, district, category, halal]);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold md:text-4xl">Browse surplus food</h1>
        <p className="mt-2 text-muted-foreground">
          {loading ? "Loading nearby food…" : `${filtered.length} surprise bags & meals available.`}
        </p>

        <div className="mt-6 rounded-3xl border bg-card p-4 shadow-sm">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search meals or merchants…"
              className="pl-9 rounded-full"
            />
          </div>

          <FilterRow label="District" value={district} onChange={setDistrict} options={DISTRICTS as readonly string[]} />
          <FilterRow label="Category" value={category} onChange={setCategory} options={CATEGORIES as readonly string[]} />
          <FilterRow
            label="Halal"
            value={halal}
            onChange={setHalal}
            options={HALAL_STATUSES.map((h) => h.value)}
            labelFor={(v) => HALAL_STATUSES.find((h) => h.value === v)?.label ?? v}
          />
        </div>

        <div className="mt-6">
          <AdSlot size="leaderboard" id="browse-top" label="Sponsored" />
        </div>

        {filtered.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl border bg-card p-10 text-center">
            <div className="text-lg font-semibold">No food matches your filters</div>
            <p className="mt-2 text-sm text-muted-foreground">Try clearing a filter or check back later — new bags drop throughout the day.</p>
            <Button className="mt-4 rounded-full" onClick={() => { setQ(""); setDistrict(""); setCategory(""); setHalal(""); }}>Clear filters</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <Fragment key={l.id}>
                <ListingCard listing={l} />
                {(i + 1) % 6 === 0 && i !== filtered.length - 1 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <AdSlot size="billboard" id={`browse-inline-${i}`} label="Sponsored" />
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
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <Chip active={value === ""} onClick={() => onChange("")}>All</Chip>
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>
          {labelFor ? labelFor(o) : o}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} type="button">
      <Badge
        variant={active ? "default" : "secondary"}
        className="cursor-pointer rounded-full px-3 py-1 text-xs"
      >
        {children}
      </Badge>
    </button>
  );
}
