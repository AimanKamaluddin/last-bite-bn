import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "ms";

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const STORAGE_KEY = "lastbite-language";

const translations = {
  en: {
    about: "About",
    browseFood: "Browse Food",
    forBusinesses: "For Businesses",
    signIn: "Sign in",
    myOrders: "My orders",
    merchantDashboard: "Merchant dashboard",
    adminPanel: "Admin panel",
    signOut: "Sign out",
    toggleMenu: "Toggle menu",
    language: "Language",
    english: "English",
    malay: "Malay",
    saveGoodFood: "Save good food. Pay less. Reduce waste — proudly built for Brunei Darussalam.",
    explore: "Explore",
    browseFoodLower: "Browse food",
    aboutUs: "About us",
    joinAsMerchant: "Join as merchant",
    legal: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    foodSafety: "Food Safety Disclaimer",
    merchantAgreement: "Merchant Agreement",
    contact: "Contact",
    allRightsReserved: "All rights reserved.",
    foodAvailableToday: "Desserts, pastries and food available today in Brunei",
    heroTitleStart: "Rescue delicious food",
    heroTitleHighlight: "before it's gone.",
    heroBody: "Find surplus desserts, pastries, bakery items and meals from local businesses. Reserve in seconds, collect during the pickup window.",
    reserveNow: "Browse All",
    pickupToday: "Pickup today",
    shortPickupWindows: "Short pickup windows.",
    payLess: "Pay less",
    discountedLocalFood: "Discounted desserts, pastries and meals.",
    wasteLess: "Waste less",
    giveGoodFoodChance: "Give good food another chance.",
    sponsored: "Sponsored",
    featuredSponsor: "Featured sponsor",
    viewProfile: "View profile",
    availableNow: "Available Now",
    bakery: "Bakery & Pastry",
    meals: "Meals",
    desserts: "Desserts",
    underBndFive: "Under BND 5",
    highestDiscount: "Highest Discount",
    nearMe: "Near Me",
    availableRightNow: "Available right now",
    reserveBeforePickup: "Reserve before the pickup window closes.",
    browseAll: "Browse all",
    sellingFast: "Selling fast",
    limitedQuantities: "Limited quantities available.",
    onlyLeft: "Only {count} left",
    reserve: "Reserve",
    howItWorks: "How it works",
    howItWorksSubtitle: "Choose a dessert, pastry or meal offer, reserve it, and collect during the pickup window.",
    discover: "Discover",
    discoverBody: "See desserts, pastries and meals available today.",
    reserveStep: "Reserve",
    reserveStepBody: "Choose an offer and get your pickup code.",
    collectEnjoy: "Collect & enjoy",
    collectEnjoyBody: "Drop by during the pickup window and show your code.",
    featuredMerchants: "Featured merchants",
    featuredMerchantsSubtitle: "Local bakeries, dessert shops and kitchens offering surplus food today.",
    viewTodaysOffers: "View today's offers",
    whyPeopleLove: "Why people love Last Bite",
    forCustomers: "For customers",
    forBusinessesCard: "For businesses",
    customerBenefit1: "See available desserts, pastries and meals immediately",
    customerBenefit2: "Reserve before pickup windows close",
    customerBenefit3: "Discover new local bakeries and kitchens",
    customerBenefit4: "Save money on desserts, pastries and meals",
    businessBenefit1: "List unsold food quickly",
    businessBenefit2: "Reach nearby customers",
    businessBenefit3: "Reduce food waste",
    businessBenefit4: "Simple dashboard, no extra hardware",
    foodWasteImpact: "Food waste impact",
    foodWasteTitle: "Small choices can reduce food waste.",
    foodWasteBody: "Last Bite connects customers with surplus desserts, pastries and meals from local businesses, making it easier to support merchants while giving good food another chance.",
    faq: "Frequently asked questions",
    faqSafeQ: "Is the food safe to eat?",
    faqSafeA: "Merchants are responsible for listing food that is safe to eat and within collection windows, including any allergen information customers need.",
    faqKindQ: "What kind of food can I reserve?",
    faqKindA: "It depends on what each merchant has available. It could be pastries, bread, cakes, desserts, a meal, or a food bundle.",
    faqPayQ: "How do I pay?",
    faqPayA: "For now, payment is made directly to the merchant during pickup.",
    faqCancelQ: "Can I cancel a reservation?",
    faqCancelA: "You can cancel before collection, but please only reserve food you intend to pick up.",
  },
  ms: {
    about: "Tentang",
    browseFood: "Cari Makanan",
    forBusinesses: "Untuk Perniagaan",
    signIn: "Log masuk",
    myOrders: "Pesanan saya",
    merchantDashboard: "Papan pemuka peniaga",
    adminPanel: "Panel admin",
    signOut: "Log keluar",
    toggleMenu: "Buka/tutup menu",
    language: "Bahasa",
    english: "Inggeris",
    malay: "Melayu",
    saveGoodFood: "Selamatkan makanan yang masih baik. Bayar kurang. Kurangkan pembaziran — dibina khas untuk Brunei Darussalam.",
    explore: "Teroka",
    browseFoodLower: "Cari makanan",
    aboutUs: "Tentang kami",
    joinAsMerchant: "Daftar sebagai peniaga",
    legal: "Undang-undang",
    terms: "Terma & Syarat",
    privacy: "Dasar Privasi",
    foodSafety: "Penafian Keselamatan Makanan",
    merchantAgreement: "Perjanjian Peniaga",
    contact: "Hubungi",
    allRightsReserved: "Hak cipta terpelihara.",
    foodAvailableToday: "Pencuci mulut, pastri dan makanan tersedia hari ini di Brunei",
    heroTitleStart: "Selamatkan makanan sedap",
    heroTitleHighlight: "sebelum habis.",
    heroBody: "Cari lebihan pencuci mulut, pastri, roti dan makanan daripada perniagaan tempatan. Tempah dalam beberapa saat dan ambil dalam waktu pengambilan.",
    reserveNow: "Lihat Semua",
    pickupToday: "Ambil hari ini",
    shortPickupWindows: "Waktu pengambilan singkat.",
    payLess: "Bayar kurang",
    discountedLocalFood: "Pencuci mulut, pastri dan makanan berdiskaun.",
    wasteLess: "Kurangkan pembaziran",
    giveGoodFoodChance: "Beri makanan baik peluang kedua.",
    sponsored: "Ditaja",
    featuredSponsor: "Penaja pilihan",
    viewProfile: "Lihat profil",
    availableNow: "Tersedia Sekarang",
    bakery: "Roti & Pastri",
    meals: "Makanan",
    desserts: "Pencuci mulut",
    underBndFive: "Bawah BND 5",
    highestDiscount: "Diskaun Tertinggi",
    nearMe: "Berdekatan Saya",
    availableRightNow: "Tersedia sekarang",
    reserveBeforePickup: "Tempah sebelum waktu pengambilan tamat.",
    browseAll: "Lihat semua",
    sellingFast: "Cepat habis",
    limitedQuantities: "Kuantiti terhad.",
    onlyLeft: "Tinggal {count} sahaja",
    reserve: "Tempah",
    howItWorks: "Cara ia berfungsi",
    howItWorksSubtitle: "Pilih tawaran pencuci mulut, pastri atau makanan, tempah, dan ambil dalam waktu pengambilan.",
    discover: "Cari",
    discoverBody: "Lihat pencuci mulut, pastri dan makanan yang tersedia hari ini.",
    reserveStep: "Tempah",
    reserveStepBody: "Pilih tawaran dan dapatkan kod pengambilan anda.",
    collectEnjoy: "Ambil & nikmati",
    collectEnjoyBody: "Datang dalam waktu pengambilan dan tunjukkan kod anda.",
    featuredMerchants: "Peniaga pilihan",
    featuredMerchantsSubtitle: "Kedai roti, kedai pencuci mulut dan dapur tempatan yang menawarkan lebihan makanan hari ini.",
    viewTodaysOffers: "Lihat tawaran hari ini",
    whyPeopleLove: "Mengapa orang suka Last Bite",
    forCustomers: "Untuk pelanggan",
    forBusinessesCard: "Untuk perniagaan",
    customerBenefit1: "Lihat pencuci mulut, pastri dan makanan tersedia dengan segera",
    customerBenefit2: "Tempah sebelum waktu pengambilan tamat",
    customerBenefit3: "Cari kedai roti dan dapur tempatan baharu",
    customerBenefit4: "Jimat untuk pencuci mulut, pastri dan makanan",
    businessBenefit1: "Senaraikan makanan tidak terjual dengan cepat",
    businessBenefit2: "Capai pelanggan berdekatan",
    businessBenefit3: "Kurangkan pembaziran makanan",
    businessBenefit4: "Papan pemuka mudah, tanpa perkakasan tambahan",
    foodWasteImpact: "Impak pembaziran makanan",
    foodWasteTitle: "Pilihan kecil boleh mengurangkan pembaziran makanan.",
    foodWasteBody: "Last Bite menghubungkan pelanggan dengan lebihan pencuci mulut, pastri dan makanan daripada perniagaan tempatan, memudahkan sokongan kepada peniaga sambil memberi makanan baik peluang kedua.",
    faq: "Soalan lazim",
    faqSafeQ: "Adakah makanan selamat dimakan?",
    faqSafeA: "Peniaga bertanggungjawab menyenaraikan makanan yang selamat dimakan dalam waktu pengambilan, termasuk maklumat alergen yang diperlukan pelanggan.",
    faqKindQ: "Jenis makanan apa yang boleh saya tempah?",
    faqKindA: "Ia bergantung kepada apa yang tersedia daripada setiap peniaga. Ia boleh jadi pastri, roti, kek, pencuci mulut, hidangan makanan atau bungkusan makanan.",
    faqPayQ: "Bagaimana saya membayar?",
    faqPayA: "Buat masa ini, bayaran dibuat terus kepada peniaga semasa pengambilan.",
    faqCancelQ: "Bolehkah saya batalkan tempahan?",
    faqCancelA: "Anda boleh batalkan sebelum pengambilan, tetapi sila tempah hanya jika anda benar-benar ingin mengambil makanan tersebut.",
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ms") setLanguageState(saved);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage === "ms" ? "ms" : "en";
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(language === "en" ? "ms" : "en"),
    t: (key) => translations[language][key] ?? translations.en[key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
