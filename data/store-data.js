// Mission Log — Store Data
// STORES: Guelph grocery store info, card strategy, price tiers
// Loaded before app.js — exposes window.STORES globally
window.STORES = {
  costco: {
    name: "Costco",
    emoji: "🏪",
    color: "#3b82f6",
    amex: false,
    card: "Costco Mastercard",
    cardEmoji: "🟦",
    cardNote: "2% cash back at Costco · Only accepted card",
    priceRank: 1,
    priceTier: "Budget",
    bestFor: "Bulk proteins, salmon, eggs, oats, olive oil, nuts, frozen veg, Greek yogurt (large tub), protein powder",
    note: "Mastercard ONLY in Canada. Best bulk unit prices by far.",
    avoid: false
  },
  walmart: {
    name: "Walmart",
    emoji: "🛒",
    color: "#fbbf24",
    amex: false,
    card: "TD Visa Infinite Aeroplan",
    cardEmoji: "🟥",
    cardNote: "1.5x Aeroplan on groceries · Amex not accepted here",
    priceRank: 2,
    priceTier: "Budget",
    bestFor: "Pantry staples, canned goods, rice, pasta, dairy, condiments, sauces",
    note: "Visa/MC only. Reliable low prices. General merchandise MCC.",
    avoid: false
  },
  metro: {
    name: "Metro",
    emoji: "🥬",
    color: "#ef4444",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC · Air Miles",
    priceRank: 3,
    priceTier: "Mid-range",
    bestFor: "Fresh produce, weekly sales, fresh meat, deli items",
    note: "Amex ✓ — Cobalt earns 5x MR here. Air Miles also earns.",
    avoid: false
  },
  farmboy: {
    name: "Farm Boy",
    emoji: "🌽",
    color: "#22c55e",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC",
    priceRank: 4,
    priceTier: "Premium",
    bestFor: "Best fresh fish, premium produce, specialty/health items, prepared foods",
    note: "Amex ✓ — Cobalt earns 5x MR here. Higher prices but top quality.",
    avoid: false
  },
  longos: {
    name: "Longos",
    emoji: "🍋",
    color: "#a855f7",
    amex: true,
    card: "Cobalt Amex",
    cardEmoji: "🟩",
    cardNote: "5x MR points on groceries · Grocery MCC",
    priceRank: 4,
    priceTier: "Premium",
    bestFor: "Specialty items, prepared foods, bakery, fresh produce",
    note: "Amex ✓ — Cobalt earns 5x MR here. Verify Guelph location.",
    avoid: false
  }
};
