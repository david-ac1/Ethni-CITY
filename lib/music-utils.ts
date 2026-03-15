/**
 * Shared utilities for music engine operations.
 */

/**
 * Maps common country names to ISO-2 codes for music store lookup (Spotify/iTunes).
 */
export function getMarketCode(countryName: string): string {
  const mapping: Record<string, string> = {
    "Morocco": "MA",
    "Belgium": "BE",
    "Nigeria": "NG",
    "Senegal": "SN",
    "Mali": "ML",
    "Brazil": "BR",
    "Colombia": "CO",
    "Mexico": "MX",
    "South Africa": "ZA",
    "Kenya": "KE",
    "Ghana": "GH",
    "Ethiopia": "ET",
    "Egypt": "EG",
    "Algeria": "DZ",
    "Tunisia": "TN",
    "United States": "US",
    "United Kingdom": "GB",
    "France": "FR",
    "Germany": "DE",
    "Japan": "JP",
    "Thailand": "TH",
    "Indonesia": "ID",
    "Vietnam": "VN",
    "India": "IN",
  };
  return mapping[countryName] || "US";
}
