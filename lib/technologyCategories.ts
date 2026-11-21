// The categories of care a technology belongs to, in the order the /technology gallery shows them.
// Shared by the Technologies collection (the admin's select) and the gallery's filter buttons.
// Adding one here needs a database migration, since the select is stored as a Postgres enum.
export const TECHNOLOGY_CATEGORIES = [
  { value: 'respiratory', label: 'Respiratory Support' },
  { value: 'thermal', label: 'Thermal Care' },
  { value: 'hydration', label: 'Hydration, Nutrition & Drug Delivery' },
  { value: 'jaundice', label: 'Jaundice Management' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'diagnostics', label: 'Diagnostics' },
] as const

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number]['value']

export function categoryLabel(value: string | null | undefined) {
  return TECHNOLOGY_CATEGORIES.find((category) => category.value === value)?.label
}
