/**
 * Everything the user can change about how the app looks.
 *
 * Themes are pure CSS: each id matches a `:root[data-theme="..."]` block in
 * global.css, so switching one is a single attribute write with no re-render
 * of the tree. Backgrounds are either a CSS layer class or the animated
 * particle canvas.
 */

export type ThemeId = 'shadow' | 'crimson' | 'jade' | 'amethyst' | 'abyss' | 'ember' | 'slate' | 'paper' | 'daylight'
export type BackgroundId = 'motes' | 'aurora' | 'nebula' | 'stars' | 'grid' | 'shafts' | 'glow' | 'plain'
export type MotionLevel = 'full' | 'calm' | 'still'
export type ReadingSize = 'compact' | 'comfortable' | 'large'
export type ReadingWidth = 'narrow' | 'medium' | 'wide'

export interface ThemeDef {
  id: ThemeId
  name: string
  note: string
  light: boolean
  /** Swatch colours for the picker: page, surface, accent, text. */
  swatch: [string, string, string, string]
}

export const THEMES: ThemeDef[] = [
  { id: 'shadow', name: 'Shadow Monarch', note: 'Near-black with electric blue. The original.', light: false, swatch: ['#05070a', '#10161f', '#4da3ff', '#dfe7e0'] },
  { id: 'crimson', name: 'Crimson Gate', note: 'Warm black and vermilion, closest to the Kage look.', light: false, swatch: ['#08060a', '#1a1216', '#e03c32', '#ebe2e2'] },
  { id: 'jade', name: 'Verdant Depths', note: 'Deep green-black with a jade accent. Easy on the eyes.', light: false, swatch: ['#04090a', '#0e1a19', '#3fd6a0', '#dfe9e4'] },
  { id: 'amethyst', name: 'Amethyst', note: 'Violet-tinted dark, softer than pure black.', light: false, swatch: ['#08060e', '#181326', '#a380ff', '#e5e0ee'] },
  { id: 'abyss', name: 'Abyss', note: 'Deep navy with cyan. Cool and calm.', light: false, swatch: ['#050b16', '#0f1c2e', '#38c8f0', '#dce7f5'] },
  { id: 'ember', name: 'Ember', note: 'Warm brown-black with amber. Gentle at night.', light: false, swatch: ['#0c0906', '#1e1710', '#f09e42', '#f0e6d8'] },
  { id: 'slate', name: 'Slate', note: 'Lighter grey dark mode. Less contrast, less strain.', light: false, swatch: ['#121417', '#23282e', '#78aaff', '#e6e8ea'] },
  { id: 'paper', name: 'Paper', note: 'Warm light theme. Reads like a printed book.', light: true, swatch: ['#f3efe7', '#ffffff', '#185cbe', '#1e1b16'] },
  { id: 'daylight', name: 'Daylight', note: 'Bright, crisp and high contrast for daytime.', light: true, swatch: ['#f6f8fb', '#ffffff', '#146edc', '#111820'] },
]

export interface BackgroundDef {
  id: BackgroundId
  name: string
  note: string
  /** Whether this background moves. Used to warn on reading pages. */
  animated: boolean
  /** CSS class for the layer, or null when the canvas renderer is used. */
  className: string | null
}

export const BACKGROUNDS: BackgroundDef[] = [
  { id: 'motes', name: 'Drifting motes', note: 'Floating particles that follow your cursor. The liveliest option.', animated: true, className: null },
  { id: 'aurora', name: 'Aurora', note: 'Soft colour blobs that drift very slowly.', animated: true, className: 'bg-aurora' },
  { id: 'nebula', name: 'Nebula', note: 'Two large washes of colour that breathe.', animated: true, className: 'bg-nebula' },
  { id: 'stars', name: 'Still stars', note: 'The look of the particle field, frozen in place.', animated: false, className: 'bg-stars' },
  { id: 'grid', name: 'Blueprint grid', note: 'A faint technical grid that fades toward the bottom.', animated: false, className: 'bg-grid' },
  { id: 'shafts', name: 'Light shafts', note: 'Angled beams of light. Still, with a sense of depth.', animated: false, className: 'bg-shafts' },
  { id: 'glow', name: 'Single glow', note: 'One soft light above and a vignette. The calmest choice.', animated: false, className: 'bg-glow' },
  { id: 'plain', name: 'Nothing', note: 'Flat colour. No texture, no light, no distraction.', animated: false, className: 'bg-plain' },
]

export const MOTION_LEVELS: { id: MotionLevel; name: string; note: string }[] = [
  { id: 'full', name: 'Full', note: 'Backgrounds move and panels animate in.' },
  { id: 'calm', name: 'Calm', note: 'Backgrounds hold still. Interface transitions stay.' },
  { id: 'still', name: 'Still', note: 'Nothing animates anywhere in the app.' },
]

export const READING_SIZES: { id: ReadingSize; name: string; px: string }[] = [
  { id: 'compact', name: 'Compact', px: '14px' },
  { id: 'comfortable', name: 'Comfortable', px: '15px' },
  { id: 'large', name: 'Large', px: '17px' },
]

export const READING_WIDTHS: { id: ReadingWidth; name: string; value: string }[] = [
  { id: 'narrow', name: 'Narrow', value: '58ch' },
  { id: 'medium', name: 'Medium', value: '68ch' },
  { id: 'wide', name: 'Wide', value: '80ch' },
]

export interface Appearance {
  theme: ThemeId
  /** Background for browsing pages: dashboard, gates, calendar and so on. */
  background: BackgroundId
  /** Background for reading and practice pages. */
  readingBackground: BackgroundId
  /** When true, reading pages reuse `background` instead of `readingBackground`. */
  sameBackgroundEverywhere: boolean
  motion: MotionLevel
  grain: boolean
  /** The faint sheet behind long-form text. */
  readingSheet: boolean
  readingSize: ReadingSize
  readingWidth: ReadingWidth
}

export const defaultAppearance: Appearance = {
  theme: 'shadow',
  background: 'motes',
  readingBackground: 'glow',
  sameBackgroundEverywhere: false,
  motion: 'full',
  grain: true,
  readingSheet: true,
  readingSize: 'comfortable',
  readingWidth: 'medium',
}

export const getTheme = (id: ThemeId) => THEMES.find((t) => t.id === id) ?? THEMES[0]
export const getBackground = (id: BackgroundId) => BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0]

/** Push the parts of the appearance that live on <html> and :root. */
export const applyAppearance = (a: Appearance) => {
  const root = document.documentElement
  root.setAttribute('data-theme', a.theme)
  root.style.setProperty('--reading-size', READING_SIZES.find((s) => s.id === a.readingSize)?.px ?? '15px')
  root.style.setProperty('--reading-width', READING_WIDTHS.find((w) => w.id === a.readingWidth)?.value ?? '68ch')
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', getTheme(a.theme).swatch[0])
}

/** Read the live accent colour so the canvas renderer matches the theme. */
export const readAccent = (): string => {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim()
  return rgb ? `rgb(${rgb.replace(/\s+/g, ',')})` : '#7cc0ff'
}
