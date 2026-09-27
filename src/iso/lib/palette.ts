/** Color/SurfaceTop · Color/SurfaceLeft · Color/SurfaceRight — her nesne için üç ton (Madde 4). */
export type Hue = 'blue' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate'

export const FACES: Record<Hue, { name: string; top: string; left: string; right: string }> = {
  blue: { name: 'Mavi', top: '#60A5FA', left: '#3B82F6', right: '#1D4ED8' },
  emerald: { name: 'Zümrüt', top: '#34D399', left: '#10B981', right: '#047857' },
  amber: { name: 'Kehribar', top: '#FCD34D', left: '#F59E0B', right: '#B45309' },
  violet: { name: 'Menekşe', top: '#A78BFA', left: '#8B5CF6', right: '#6D28D9' },
  rose: { name: 'Gül', top: '#FB7185', left: '#F43F5E', right: '#BE123C' },
  slate: { name: 'Arduvaz', top: 'var(--slate-top)', left: 'var(--slate-left)', right: 'var(--slate-right)' },
}

/** Etiket kuralı: üst yüzde koyu mürekkep (en az 6,56:1), sağ yüzde beyaz (en az 5,02:1), sol yüzde metin yok. */
export const LABEL_INK = '#0F172A'
export const CONTRAST: Record<Exclude<Hue, 'slate'>, { top: number; right: number }> = {
  blue: { top: 7.02, right: 6.7 },
  emerald: { top: 9.29, right: 5.48 },
  amber: { top: 12.38, right: 5.02 },
  violet: { top: 6.56, right: 7.1 },
  rose: { top: 6.63, right: 6.29 },
}
