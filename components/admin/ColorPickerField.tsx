'use client'

import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import { brandColors, hexColorPattern } from '@/lib/colors'

// Admin-only field for picking a background color. Shows the brand colors as quick picks, a
// color wheel for custom colors, and a hex input so staff can paste an exact code.
// Inline styles because the admin panel doesn't load the site's Tailwind CSS; the
// --theme-elevation-* variables are Payload's admin colors, so it matches light and dark mode.
export const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const [draft, setDraft] = useState<string | null>(null) // what's typed in the hex box, until it's valid
  const [showPicker, setShowPicker] = useState(false)

  const pick = (hex: string) => {
    setValue(hex.toLowerCase())
    setDraft(null)
  }

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <FieldLabel label={field.label || 'Background color'} path={path} />

      {/* Brand colors, plus "None" to clear it */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0' }}>
        <button
          type="button"
          onClick={() => {
            setValue(null)
            setDraft(null)
          }}
          title="No background"
          style={swatchStyle(!value)}
        >
          ∅
        </button>
        {brandColors.map((color) => (
          <button
            key={color.hex}
            type="button"
            onClick={() => pick(color.hex)}
            title={`${color.name} ${color.hex}`}
            aria-label={color.name}
            style={{ ...swatchStyle(value === color.hex), background: color.hex }}
          />
        ))}
      </div>

      {/* Hex code box and a button to open the color wheel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          aria-hidden="true"
          style={{ ...swatchStyle(false), background: value || 'transparent', cursor: 'default' }}
        />
        <input
          type="text"
          value={draft ?? value ?? ''}
          placeholder="#004167"
          maxLength={7}
          onChange={(e) => {
            const next = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
            setDraft(next)
            if (hexColorPattern.test(next)) pick(next) // only save complete codes
          }}
          onBlur={() => setDraft(null)} // drop an unfinished code
          style={{
            width: 110,
            padding: '6px 8px',
            fontFamily: 'monospace',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'var(--theme-input-bg, var(--theme-elevation-0))',
            color: 'var(--theme-text)',
          }}
        />
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 4,
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
            cursor: 'pointer',
          }}
        >
          {showPicker ? 'Close picker' : 'Custom color'}
        </button>
      </div>

      {showPicker && (
        <div style={{ marginTop: 12 }}>
          <HexColorPicker color={value || '#ffffff'} onChange={pick} />
        </div>
      )}

      {field.admin?.description && typeof field.admin.description === 'string' && (
        <p style={{ marginTop: 8, color: 'var(--theme-elevation-500)', fontSize: 13 }}>{field.admin.description}</p>
      )}
      {showError && <p style={{ marginTop: 4, color: 'var(--theme-error-500)' }}>{errorMessage}</p>}
    </div>
  )
}

// A round color button; the selected one gets a thicker ring
function swatchStyle(selected: boolean): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: selected ? '3px solid var(--theme-text)' : '1px solid var(--theme-elevation-250)',
    cursor: 'pointer',
    padding: 0,
    background: 'transparent',
    color: 'var(--theme-text)',
  }
}