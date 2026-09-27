export type Tone = 'base' | 'pink' | 'purple' | 'blue' | 'mint' | 'butter' | 'lilac' | 'primary'
export type Volume = 'sm' | 'md' | 'lg' | 'xl'

/** Effects/ClayVolume: her boyutun hacim birimi d (px). Üç gölge bu tek sayıdan türer. */
export const VOLUME_D: Record<Volume, number> = { sm: 2, md: 4, lg: 6, xl: 8 }

export const clayClass = (tone: Tone = 'base', volume: Volume = 'md') => `clay clay-${volume} tone-${tone}`
