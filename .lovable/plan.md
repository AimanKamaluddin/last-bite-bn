Remove all halal/Muslim-friendly/certification references from the UI since they're a given in Brunei. Keep the database columns intact (non-breaking) but stop surfacing them anywhere.

## Frontend changes

- **src/lib/sample-data.ts** — remove `halal_status` / `halal_info` fields from sample listings, drop `HALAL_STATUSES` and `halalLabel` exports, drop the related types.
- **src/routes/browse.tsx** — remove the Halal filter (state, chip, query select, filter logic, clear-filters reset) and remove "halal status" from the meta description.
- **src/routes/listing.$id.tsx** — remove the halal badge, the "Allergen & halal info" section heading becomes "Allergen info" (keep allergen list only), drop halal list item.
- **src/components/listings/ListingCard.tsx** — remove the halal badge and the `halal_status`/`halal_info` props.
- **src/routes/merchant.onboarding.tsx** — remove the "Halal status" Select field and the `halal_status` field from form state/submission.
- **src/routes/merchant.new-listing.tsx** — remove the "Halal info" Input and `halal_info` from form state/submission.
- **src/routes/index.tsx** — rewrite the Discover blurb ("filtered by district and category"), remove the "Halal-friendly filters" bullet, and edit the FAQ answer to drop "halal".
- **src/routes/legal.merchant-agreement.tsx** and **src/routes/legal.food-safety.tsx** — drop "halal" from the allergen sentences.

## Database

Leave the `halal_status` and `halal_info` columns in place (no migration). Inserts simply omit them and they fall back to defaults / null. This avoids a destructive schema change and keeps the types file stable.

## Out of scope

- No changes to backend/edge logic, payments, or auth.
- No new copy added — only removals/rewording.