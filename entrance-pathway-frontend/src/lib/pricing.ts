// Single source of truth for premium-notes pricing.
// Lifetime access, flat fee — keep simple until we add tiers.
export const PREMIUM_NOTES_PRICE_NPR = 200;

export const formatNpr = (amount: number): string =>
  `Rs. ${amount.toLocaleString()}`;
