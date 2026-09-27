export const NAV = [
  { href: '#ozellikler', label: 'Özellikler' },
  { href: '#laboratuvar', label: 'Cam laboratuvarı' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
  { href: '#erisilebilirlik', label: 'Erişilebilirlik' },
] as const

/** Laboratuvar sahnesinin sabit renkleri (temadan bağımsız) */
export const STAGE = {
  base: '#140B34',
  blobs: ['#8B5CF6', '#EC4899', '#22D3EE', '#F59E0B'],
  opacity: 0.8,
} as const

export const PALETTES = [
  {
    name: 'Koyu · derin uzay',
    base: '#0A0820',
    blobs: ['#8B5CF6', '#EC4899', '#22D3EE', '#3B82F6'],
    glass: 'rgb(18 20 46 / 0.55)',
    text: '#FFFFFF',
    muted: '#C9CDEA',
    worst: { text: '8,41', muted: '5,37' },
  },
  {
    name: 'Açık · holografik',
    base: '#EEF0FF',
    blobs: ['#A78BFA', '#F472B6', '#67E8F9', '#FCD34D'],
    glass: 'rgb(255 255 255 / 0.50)',
    text: '#0B1020',
    muted: '#3D4466',
    worst: { text: '12,73', muted: '6,37' },
  },
] as const

export const ALPHAS = [5, 10, 20, 40, 60] as const

export const BLUR_TOKENS = [
  { token: 'Effects/BackdropBlur/Sm', desktop: 8, mobile: 8, use: 'Çip, küçük rozet' },
  { token: 'Effects/BackdropBlur/Md', desktop: 16, mobile: 10, use: 'Liste, ikincil kart' },
  { token: 'Effects/BackdropBlur/Lg', desktop: 24, mobile: 14, use: 'Cam panel (varsayılan)' },
  { token: 'Effects/BackdropBlur/Xl', desktop: 40, mobile: 20, use: 'Gezinme çubuğu, modal' },
] as const

export const PROMPTS = [
  {
    q: 'Bu haftanın harcamalarını özetle',
    a: 'Bu hafta 18.420 TL harcadınız, geçen haftadan %12 az. En büyük kalem kira dışı sabit giderler (6.150 TL). Market harcaması bütçenin %8 altında.',
  },
  {
    q: 'Portföy riskini açıkla',
    a: 'Portföyün %46’sı hisse senedinde. Son 30 günde günlük oynaklık %1,4 oldu. Tek bir hissenin payı %15’i aşmıyor; yoğunlaşma riski düşük.',
  },
  {
    q: 'Gelecek ay için bir tasarruf planı öner',
    a: 'Aylık gelirin %20’sini maaş günü otomatik ayırmayı öneririm: 9.600 TL. Bunun 6.000 TL’si acil durum fonuna, kalanı düşük riskli fona gidebilir.',
  },
] as const

export const HOLDINGS = [
  { label: 'Hisse senedi', share: 0.46, color: 'var(--blob-1)' },
  { label: 'Tahvil', share: 0.28, color: 'var(--blob-3)' },
  { label: 'Döviz', share: 0.16, color: 'var(--blob-2)' },
  { label: 'Nakit', share: 0.1, color: 'var(--blob-4)' },
] as const

export const WATCHLIST = [
  { code: 'ATLS', name: 'Atlas Enerji', price: '184,20', change: 2.4 },
  { code: 'KYFN', name: 'Kıyı Finans', price: '62,75', change: -0.8 },
  { code: 'MRMR', name: 'Marmara Teknoloji', price: '311,50', change: 1.1 },
] as const
