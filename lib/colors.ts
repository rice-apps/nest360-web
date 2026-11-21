// NEST360 brand colors from the Figma design system. Same values as the --color-nest-* tokens in
// app/(frontend)/globals.css. Used as quick picks in the admin's color picker.
export const brandColors = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Neutral 100', hex: '#f8f9fa' },
  { name: 'Neutral 200', hex: '#f1f3f5' },
  { name: 'Light Blue', hex: '#6ccad0' },
  { name: 'Accent', hex: '#82cdbf' },
  { name: 'Lavender', hex: '#bfa1cc' },
  { name: 'Yellow', hex: '#fddb00' },
  { name: 'Coral', hex: '#f58966' },
  { name: 'NEST Blue', hex: '#004167' },
]

// A full 6-digit hex color, e.g. #004167
export const hexColorPattern = /^#[0-9a-fA-F]{6}$/

// True for dark backgrounds, so text on them should be white. Uses the WCAG relative-luminance formula.
export function isDarkColor(hex: string): boolean {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.4
}