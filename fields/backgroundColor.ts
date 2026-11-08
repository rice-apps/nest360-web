import type { TextField } from 'payload'

import { hexColorPattern } from '../lib/colors'

// A background color for a block, stored as a hex code like "#f1f3f5". Blank means no background.
// Editors pick it with the color picker in components/admin/ColorPickerField.tsx.
// Reusable: add `backgroundColor` to any block's fields to give it the same option.
export const backgroundColor: TextField = {
  name: 'backgroundColor',
  type: 'text',
  admin: {
    description: 'Optional. Pick a brand color or any custom color. Text turns white on dark colors.',
    components: {
      // Path is relative to the project root (importMap baseDir in payload.config.ts)
      Field: '/components/admin/ColorPickerField#ColorPickerField',
    },
  },
  // Checked on the server too, so the API can't save something that isn't a hex color
  validate: (value: string | null | undefined) =>
    !value || hexColorPattern.test(value) || 'Use a 6-digit hex color, e.g. #004167.',
}