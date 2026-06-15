// Sample merchants & listings shown on the marketplace when the database is empty
// (the real ones from the database take priority — see browse.tsx).

export type SampleMerchant = {
  id: string;
  business_name: string;
  business_type: string;
  district: string;
  halal_status: "halal_certified" | "muslim_friendly" | "not_specified";
  rating: number;
  image_url: string;
};

export type SampleListing = {
  id: string;
  merchant: SampleMerchant;
  title: string;
  category: string;
  description: string;
  original_price: number;
  discounted_price: number;
  quantity_available: number;
  pickup_start: string;
  pickup_end: string;
  image_url: string;
  allergen_info: string;
  halal_info: string;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;

export const sampleMerchants: SampleMerchant[] = [
  {
    id: "m1",
    business_name: "Gadong Bakery House",
    business_type: "Bakery",
    district: "Brunei-Muara",
    halal_status: "halal_certified",
    rating: 4.8,
    image_url: img("photo-1509440159596-0249088772ff"),
  },
  {
    id: "m2",
    business_name: "Kiulap Cafe Corner",
    business_type: "Cafe",
    district: "Brunei-Muara",
    halal_status: "muslim_friendly",
    rating: 4.6,
    image_url: img("photo-1453614512568-c4024d13c247"),
  },
  {
    id: "m3",
    business_name: "Seria Fresh Mart",
    business_type: "Supermarket",
    district: "Belait",
    halal_status: "halal_certified",
    rating: 4.4,
    image_url: img("photo-1542838132-92c53300491e"),
  },
  {
    id: "m4",
    business_name: "Jerudong Hotel Kitchen",
    business_type: "Hotel",
    district: "Brunei-Muara",
    halal_status: "halal_certified",
    rating: 4.9,
    image_url: img("photo-1414235077428-338989a2e8c0"),
  },
  {
    id: "m5",
    business_name: "Tutong Local Eats",
    business_type: "Local food",
    district: "Tutong",
    halal_status: "halal_certified",
    rating: 4.7,
    image_url: img("photo-1504674900247-0877df9cc836"),
  },
  {
    id: "m6",
    business_name: "Muara Seafood Kitchen",
    business_type: "Restaurant",
    district: "Brunei-Muara",
    halal_status: "halal_certified",
    rating: 4.5,
    image_url: img("photo-1467003909585-2f8a72700288"),
  },
];

export const sampleListings: SampleListing[] = [
  {
    id: "l1",
    merchant: sampleMerchants[0],
    title: "Surprise Pastry Bag",
    category: "Bakery",
    description: "A mix of today's unsold pastries, croissants, and sweet buns.",
    original_price: 18,
    discounted_price: 6,
    quantity_available: 4,
    pickup_start: "17:30",
    pickup_end: "19:00",
    image_url: img("photo-1555507036-ab1f4038808a"),
    allergen_info: "Contains: gluten, dairy, eggs",
    halal_info: "Halal certified",
  },
  {
    id: "l2",
    merchant: sampleMerchants[4],
    title: "Mixed Nasi Box",
    category: "Local food",
    description: "Leftover nasi katok and ayam penyet packed fresh from the kitchen.",
    original_price: 12,
    discounted_price: 4.5,
    quantity_available: 6,
    pickup_start: "20:00",
    pickup_end: "21:30",
    image_url: img("photo-1604908176997-125f25cc6f3d"),
    allergen_info: "Contains: peanuts",
    halal_info: "Halal certified",
  },
  {
    id: "l3",
    merchant: sampleMerchants[3],
    title: "Bento Leftovers",
    category: "Hotel",
    description: "Hotel buffet bento packs — rice, protein, vegetables.",
    original_price: 22,
    discounted_price: 8,
    quantity_available: 3,
    pickup_start: "22:00",
    pickup_end: "22:45",
    image_url: img("photo-1546069901-ba9599a7e63c"),
    allergen_info: "May contain: soy, sesame",
    halal_info: "Halal certified",
  },
  {
    id: "l4",
    merchant: sampleMerchants[0],
    title: "Fresh Bread Bundle",
    category: "Bakery",
    description: "Two loaves of artisan bread baked this morning.",
    original_price: 14,
    discounted_price: 5,
    quantity_available: 5,
    pickup_start: "18:00",
    pickup_end: "19:30",
    image_url: img("photo-1509440159596-0249088772ff"),
    allergen_info: "Contains: gluten",
    halal_info: "Halal certified",
  },
  {
    id: "l5",
    merchant: sampleMerchants[1],
    title: "Dessert Box",
    category: "Desserts",
    description: "Cakes, slices and tarts from today's display.",
    original_price: 20,
    discounted_price: 7,
    quantity_available: 2,
    pickup_start: "19:30",
    pickup_end: "20:30",
    image_url: img("photo-1488477181946-6428a0291777"),
    allergen_info: "Contains: dairy, gluten, eggs, nuts",
    halal_info: "Muslim-friendly",
  },
  {
    id: "l6",
    merchant: sampleMerchants[2],
    title: "Grocery Rescue Bag",
    category: "Groceries",
    description: "Near-expiry fruits, vegetables and packaged goods.",
    original_price: 25,
    discounted_price: 9,
    quantity_available: 7,
    pickup_start: "16:00",
    pickup_end: "20:00",
    image_url: img("photo-1542838132-92c53300491e"),
    allergen_info: "Varies by item",
    halal_info: "Halal certified",
  },
];

export const DISTRICTS = ["Brunei-Muara", "Tutong", "Belait", "Temburong"] as const;
export const CATEGORIES = [
  "Bakery",
  "Restaurant",
  "Cafe",
  "Supermarket",
  "Hotel",
  "Local food",
  "Desserts",
  "Groceries",
] as const;
export const HALAL_STATUSES = [
  { value: "halal_certified", label: "Halal certified" },
  { value: "muslim_friendly", label: "Muslim-friendly" },
  { value: "not_specified", label: "Not specified" },
] as const;

export const halalLabel = (v: string) =>
  HALAL_STATUSES.find((h) => h.value === v)?.label ?? "Not specified";

export const formatBND = (n: number) =>
  `B$${n.toFixed(2)}`;
