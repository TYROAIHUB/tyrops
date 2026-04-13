import { shadcnThemePresets } from '@/utils/shadcn-ui-theme-presets'

export const colorThemes = Object.entries(shadcnThemePresets).map(([key, preset]) => ({
  name: preset.label || key,
  value: key,
  preset: preset
}))
