import type { IconName } from './components/GeoIcon'

export const NAV = [
  { href: '#ilkeler', label: 'İlkeler' },
  { href: '#renk', label: 'Renk' },
  { href: '#tipografi', label: 'Tipografi' },
  { href: '#grid', label: 'Grid' },
  { href: '#bilesenler', label: 'Bileşenler' },
  { href: '#uygulama', label: 'Uygulama' },
] as const

export const HERO_META = [
  { label: 'Stil', value: '001' },
  { label: 'Kategori', value: 'Modern / Minimal / Clean' },
  { label: 'Diğer adı', value: 'International Typographic Style' },
  { label: 'Köken', value: "İsviçre, 1950'ler. Zürih ve Basel" },
] as const

export const PRINCIPLES = [
  {
    name: "Grid'e mutlak sadakat",
    rule: 'Her kenar bir kolon ya da oluk çizgisine oturur. Boşluklar 8, 16, 32, 64 ve 128 değerlerinden seçilir.',
    never: 'Göz kararı konumlandırma. 13px ya da 27px gibi ara değerler.',
  },
  {
    name: 'Süssüzlük',
    rule: 'Her öğe bir bilgi taşır. Çizgi ayırır, boyut sıralar, kırmızı vurgular.',
    never: 'Gölge, gradyan, doku, yuvarlatılmış köşe, dekoratif ikon.',
  },
  {
    name: 'Nesnellik',
    rule: 'Fotoğraf olduğu gibi kullanılır: filtresiz, yüksek kontrastlı. Metin bilgiyi süslemeden verir.',
    never: 'Renk filtresi, vinyet, bulanıklık. Sıfat yığını.',
  },
  {
    name: 'Asimetrik kompozisyon',
    rule: 'Ağırlık bir tarafa toplanır, boşluk dengeyi kurar. 8 + 4, 3 + 9 ya da ofsetli 5 + 5 kolon.',
    never: 'Her şeyi ortalamak. 6 + 6 simetrik bölmeler.',
  },
  {
    name: 'Sola hizalı metin',
    rule: 'Metin sola dayanır, sağ kenar serbest kalır (ragged-right). Mobilde de aynıdır.',
    never: 'İki yana yaslama, ortalanmış paragraf, zorla tireleme.',
  },
] as const

/** Yüzey oranları önerilen dağılımdır; kırmızının yalnızca vurgu olduğunu gösterir. */
export const SWATCHES = [
  { token: 'paper', short: 'Beyaz', name: 'Saf Beyaz', role: 'Background', light: '#FFFFFF', invert: '#111111', span: 5, className: 'bg-paper border border-ink' },
  { token: 'ink', short: 'Siyah', name: 'Kömür Siyahı', role: 'Text / Surface', light: '#111111', invert: '#FFFFFF', span: 4, className: 'bg-ink' },
  { token: 'accent', short: 'Kırmızı', name: 'Swiss Kırmızısı', role: 'Accent', light: '#FF2A2A', invert: '#FF2A2A', span: 2, className: 'bg-accent' },
  { token: 'mute', short: 'Gri', name: 'Nötr Gri', role: 'Secondary', light: '#E5E5E5', invert: '#2B2B2B', span: 1, className: 'bg-mute' },
] as const

export const CONTRAST = [
  { fg: '#111111', bg: '#FFFFFF', ratio: '18.88', verdict: 'AAA', use: 'Tüm metinler.' },
  { fg: '#111111', bg: '#E5E5E5', ratio: '14.99', verdict: 'AAA', use: 'Gri yüzey üstünde tüm metinler.' },
  { fg: '#111111', bg: '#FF2A2A', ratio: '5.05', verdict: 'AA', use: 'Kırmızı zemin üstünde metin daima siyahtır.' },
  { fg: '#FF2A2A', bg: '#111111', ratio: '5.05', verdict: 'AA', use: 'Invert modunda kırmızı metin.' },
  { fg: '#FF2A2A', bg: '#FFFFFF', ratio: '3.74', verdict: 'AA büyük', use: 'Yalnızca 24px ve üstü metin, şekil ve çizgi.' },
  { fg: '#E5E5E5', bg: '#FFFFFF', ratio: '1.26', verdict: 'Metin değil', use: 'Yalnızca yüzey ve ayraç.' },
] as const

export const TYPE_SCALE = [
  { px: 120, token: 'display', sample: 'Raster', className: 'text-display font-black uppercase tracking-tighter' },
  { px: 64, token: 'h2', sample: 'Grid sistemi', className: 'text-h2 font-black uppercase tracking-tighter' },
  { px: 32, token: 'h3', sample: 'Asimetrik kompozisyon', className: 'text-h3 font-bold tracking-tight' },
  { px: 20, token: 'lead', sample: 'Metin sola hizalı, sağ kenarı serbest.', className: 'text-lead' },
  {
    px: 14,
    token: 'body',
    sample: 'Gövde metni 14px, satır aralığı 1,58. Satır uzunluğu 65 karakteri geçmez.',
    className: 'text-body',
  },
  { px: 12, token: 'label', sample: 'Etiket · büyük harf · %6 harf aralığı', className: 'swiss-label' },
] as const

export const BREAKPOINTS = [
  { name: 'sm', width: '< 768px', margin: '16px', gutter: '8px' },
  { name: 'md', width: '768–1023px', margin: '32px', gutter: '16px' },
  { name: 'lg', width: '≥ 1024px', margin: '64px', gutter: '32px' },
] as const

export const COMPOSITIONS = [
  {
    label: '8 + 4',
    blocks: [
      { start: 1, span: 8, tone: 'ink' },
      { start: 9, span: 4, tone: 'mute' },
    ],
  },
  {
    label: '3 + 9',
    blocks: [
      { start: 1, span: 3, tone: 'accent' },
      { start: 4, span: 9, tone: 'ink' },
    ],
  },
  {
    label: 'Ofset 2 · 5 + 5',
    blocks: [
      { start: 3, span: 5, tone: 'mute' },
      { start: 8, span: 5, tone: 'ink' },
    ],
  },
] as const

export const SPACING = [
  { token: 'xs', px: 8 },
  { token: 's', px: 16 },
  { token: 'm', px: 32 },
  { token: 'l', px: 64 },
  { token: 'xl', px: 128 },
] as const

export const ICONS: ReadonlyArray<{ name: IconName; label: string }> = [
  { name: 'arrow-right', label: 'Sağ ok' },
  { name: 'arrow-up-right', label: 'Çapraz ok' },
  { name: 'arrow-down', label: 'Aşağı ok' },
  { name: 'plus', label: 'Ekle' },
  { name: 'close', label: 'Kapat' },
  { name: 'menu', label: 'Menü' },
  { name: 'search', label: 'Ara' },
  { name: 'grid', label: 'Grid' },
  { name: 'download', label: 'İndir' },
  { name: 'play', label: 'Oynat' },
  { name: 'circle', label: 'Daire' },
  { name: 'square', label: 'Kare' },
]

export const PROGRAM = [
  { kind: 'Sergi', title: 'Konkret Sanat ve Grid', place: 'Salon A', date: '12 Ekim – 30 Kasım' },
  { kind: 'Konuşma', title: 'Afişte Boşluk', place: 'Oditoryum', date: '18 Ekim, 19.00' },
  { kind: 'Atölye', title: '12 Kolonla Sayfa Kurmak', place: 'Stüdyo 2', date: '25 Ekim, 14.00' },
] as const

export const PROJECTS = [
  { no: '014', name: 'Moda Kütüphanesi', place: 'Kadıköy, İstanbul', year: '2025', type: 'Kamusal' },
  { no: '013', name: 'Tuz Deposu Galeri', place: 'Konak, İzmir', year: '2024', type: 'Kültür' },
  { no: '012', name: 'Çatı Konutları', place: 'Çankaya, Ankara', year: '2023', type: 'Konut' },
  { no: '011', name: 'Liman Pavyonu', place: 'Mersin', year: '2022', type: 'Geçici yapı' },
] as const

export const TIMELINE = [
  { year: '1957', text: 'Max Miedinger ve Eduard Hoffmann, Neue Haas Grotesk. 1960’tan itibaren adı Helvetica.' },
  { year: '1957', text: 'Adrian Frutiger, Univers.' },
  { year: '1958', text: 'Neue Grafik dergisi Zürih’te yayına başlar (1958–1965).' },
  { year: '1965', text: 'Armin Hofmann, Methodik der Form- und Bildgestaltung.' },
  { year: '1967', text: 'Emil Ruder, Typographie.' },
  { year: '1981', text: 'Josef Müller-Brockmann, Rastersysteme für die visuelle Gestaltung.' },
  { year: '2017', text: 'Rasmus Andersson, Inter. Bu sayfanın yazı tipi.' },
  { year: '2019', text: 'Monotype, Helvetica Now.' },
] as const
