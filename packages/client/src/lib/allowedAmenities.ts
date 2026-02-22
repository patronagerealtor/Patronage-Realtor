/**
 * Allowed amenities: only these are shown in the admin form and property detail.
 * To remove the rest from the amenities table in Supabase, run in SQL Editor:
 *
 *   DELETE FROM amenities
 *   WHERE name NOT IN (
 *     'CCTV Surveillance', '24x7 Security', 'Gated Community', 'Reserved Parking',
 *     'Visitor Parking', 'Lift', 'Power Backup', 'Swimming Pool', 'Gymnasium',
 *     'Clubhouse', 'Kids Play Area', 'Landscaped Garden', 'Jogging Track'
 *   );
 *
 * Then remove orphaned property_amenities rows if needed (amenity_id not in amenities).
 */
export const ALLOWED_AMENITY_NAMES = [
  "CCTV Surveillance",
  "24x7 Security",
  "Gated Community",
  "Reserved Parking",
  "Visitor Parking",
  "Lift",
  "Power Backup",
  "Swimming Pool",
  "Gymnasium",
  "Clubhouse",
  "Kids Play Area",
  "Landscaped Garden",
  "Jogging Track",
] as const;

export function isAllowedAmenityName(name: string): boolean {
  return ALLOWED_AMENITY_NAMES.includes(name as (typeof ALLOWED_AMENITY_NAMES)[number]);
}
